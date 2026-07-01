import { useMemo, useState } from "react";
import "../styles/roiCalculator.css";

const PLAN_OPTIONS = {
  offline: {
    id: "offline",
    label: "Offline",
    annualCost: 15000,
    description: "Local install with focused support for cooperatives that prefer on-premise control.",
    benefit: "Good for stable, local operations but limited in remote access and automatic updates.",
  },
  online: {
    id: "online",
    label: "Online",
    annualCost: 36000,
    description: "Best for teams that need cloud access, real-time collaboration, and automatic update support.",
    benefit: "Recommended — gives your team remote access, faster handoffs, and a modern workflow edge.",
  },
};

const ROLE_TEMPLATES = [
  {
    id: "bookkeeping",
    title: "Bookkeeping",
    description: "Ledger upkeep, reconciliation, monthly reports, and member record checks.",
    defaultStaff: 2,
    defaultSalary: 30000,
    defaultHours: 8,
  },
  {
    id: "loans",
    title: "Loan Monitoring",
    description: "Payment follow-ups, statement prep, and loan status reviews.",
    defaultStaff: 1,
    defaultSalary: 28000,
    defaultHours: 6,
  },
  {
    id: "admin",
    title: "Admin / Secretary",
    description: "Compliance documents, board reports, and recurring coordination work.",
    defaultStaff: 1,
    defaultSalary: 22000,
    defaultHours: 7,
  },
  {
    id: "dividends",
    title: "Dividend & Share Reports",
    description: "Member dividend schedules, share calculations, and board-ready summaries.",
    defaultStaff: 1,
    defaultSalary: 24000,
    defaultHours: 5,
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-PH", {
    maximumFractionDigits: 0,
  }).format(value);
}

function ROICalculator() {
  const [selectedPlan, setSelectedPlan] = useState("offline");
  const [editingField, setEditingField] = useState(null);
  const [roleInputs, setRoleInputs] = useState({
    bookkeeping: { staff: 2, salary: 30000, hours: 8 },
    loans: { staff: 1, salary: 28000, hours: 6 },
    admin: { staff: 1, salary: 22000, hours: 7 },
    dividends: { staff: 1, salary: 24000, hours: 5 },
  });

  const selectedPlanMeta = PLAN_OPTIONS[selectedPlan];

  const metrics = useMemo(() => {
    const annualSavings = Object.values(roleInputs).reduce((total, role) => total + role.staff * role.salary * 12, 0);
    const planCost = PLAN_OPTIONS[selectedPlan].annualCost;
    const netAnnualSavings = annualSavings - planCost;
    const paybackDays = annualSavings > planCost ? (planCost / annualSavings) * 365 : 0;
    const coveredStaff = Object.values(roleInputs).reduce((total, role) => total + role.staff, 0);
    const workdaysPerYear = 260;
    const hoursSaved = Object.values(roleInputs).reduce((total, role) => total + role.staff * role.hours * workdaysPerYear, 0);

    return {
      annualSavings,
      netAnnualSavings,
      paybackDays,
      coveredStaff,
      hoursSaved,
    };
  }, [roleInputs, selectedPlan]);

  const updateRoleInput = (roleId, field, value) => {
    setRoleInputs((current) => ({
      ...current,
      [roleId]: {
        ...current[roleId],
        [field]: value,
      },
    }));
  };

  const estimatedAnnualSavings = metrics.netAnnualSavings;

  const handleInlineEdit = (roleId, field, value) => {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      updateRoleInput(roleId, field, parsed);
    }
  };

  const renderEditableValue = (roleId, field, value, min, max, step = 1, formatter) => {
    const key = `${roleId}-${field}`;
    const isEditing = editingField === key;

    if (isEditing) {
      return (
        <input
          className="roi_inline_input"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          autoFocus
          onBlur={() => setEditingField(null)}
          onChange={(e) => handleInlineEdit(roleId, field, e.target.value)}
        />
      );
    }

    return (
      <button
        type="button"
        className="roi_inline_value"
        onClick={() => setEditingField(key)}
      >
        {formatter ? formatter(value) : value}
      </button>
    );
  };

  const handleDemoClick = () => {
    const heroButton = document.getElementById("hero-book-demo");
    if (heroButton) {
      heroButton.click();
    } else {
      window.location.href = "#hero-book-demo";
    }
  };

  return (
    <section className="roi_section" id="roi-calculator">
      <div className="roi_section_inner">
        <div className="roi_intro">
          <p className="roi_eyebrow">ROI Calculator</p>
          <h2>See how much CORA can save your cooperative in a year.</h2>
          <p className="roi_intro_copy roi_intro_bold">
            Sa {selectedPlanMeta.label.toLowerCase()} plan, may potential kayong <strong>{formatCurrency(estimatedAnnualSavings)}</strong> net savings laban sa <strong>{formatCurrency(metrics.annualSavings)}</strong> labor cost, kasama ang <strong>{formatNumber(metrics.hoursSaved)}</strong> oras na pwedeng ilaan sa mas mataas na priority na gawain. Payback sa {metrics.paybackDays > 0 ? `${Math.round(metrics.paybackDays)} days` : "immediate"} — mabilis bumabalik ang investment.
          </p>
          <p className="roi_intro_copy roi_intro_bold">
            {selectedPlan === "online" ? "Online ang mas magandang choice kung gusto ninyo ng remote access, real-time collaboration, at automatic updates." : "Offline ay good para sa local setup, pero hindi kasing scalable at connected ng online na option."}
          </p>

          <div className="roi_plan_toggle" role="tablist" aria-label="Select CORA plan">
            {Object.values(PLAN_OPTIONS).map((plan) => (
              <button
                key={plan.id}
                type="button"
                className={`roi_plan_option roi_plan_option--${plan.id}${selectedPlan === plan.id ? " roi_plan_option--active" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="roi_plan_option_top">
                  <span>{plan.label}</span>
                  <span className="roi_plan_option_dot" />
                </div>
                <small>{plan.description}</small>
                <div className="roi_plan_option_note">{plan.benefit}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="roi_card">
          <div className="roi_card_header">
            <div>
              <p className="roi_card_eyebrow">Savings estimator</p>
              <h3>Adjust the sliders to reflect your team.</h3>
              <p className="roi_card_subtitle">Tap any value to edit it directly.</p>
            </div>
            <div className="roi_plan_badge">{selectedPlanMeta.label} plan</div>
          </div>

          <div className="roi_highlight">
            <div className="roi_highlight_main">
              <div className="roi_highlight_main_head">
                <p className="roi_highlight_label">Potential annual savings</p>
                <h4>{formatCurrency(estimatedAnnualSavings)}</h4>
                <p className="roi_highlight_subtext">After your selected annual plan cost</p>
              </div>

              <div className="roi_highlight_main_grid">
                <div className="roi_highlight_stat">
                  <span>Staff covered</span>
                  <strong>{metrics.coveredStaff}</strong>
                </div>
                <div className="roi_highlight_stat">
                  <span>Annual labor value</span>
                  <strong>{formatCurrency(metrics.annualSavings)}</strong>
                </div>
              </div>
            </div>

            <div className="roi_highlight_side">
              <div className="roi_highlight_stat">
                <span>Estimated hours saved</span>
                <strong>{formatNumber(metrics.hoursSaved)}</strong>
              </div>
              <div className="roi_highlight_stat">
                <span>Payback</span>
                <strong>{metrics.paybackDays > 0 ? `${Math.round(metrics.paybackDays)} days` : "Immediate"}</strong>
              </div>
              <button type="button" className="roi_cta_button" onClick={handleDemoClick}>
                Register for next DEMO
              </button>
            </div>
          </div>

          <div className="roi_role_grid">
            {ROLE_TEMPLATES.map((role) => {
              const input = roleInputs[role.id];
              return (
                <div className="roi_role_card" key={role.id}>
                  <div className="roi_role_heading">
                    <div>
                      <h4>{role.title}</h4>
                      <p>{role.description}</p>
                    </div>
                  </div>

                  <label className="roi_control">
                    <div className="roi_control_header">
                      <span>Number of staff handling this work</span>
                      <strong>{renderEditableValue(role.id, "staff", input.staff, 0, 8)}</strong>
                    </div>
                    <input type="range" min="0" max="8" value={input.staff} onChange={(e) => updateRoleInput(role.id, "staff", Number(e.target.value))} />
                  </label>

                  <label className="roi_control">
                    <div className="roi_control_header">
                      <span>Estimated monthly salary per staff member</span>
                      <strong>{renderEditableValue(role.id, "salary", input.salary, 0, 80000, 1000, formatCurrency)}</strong>
                    </div>
                    <input type="range" min="0" max="80000" step="1000" value={input.salary} onChange={(e) => updateRoleInput(role.id, "salary", Number(e.target.value))} />
                  </label>

                  <label className="roi_control">
                    <div className="roi_control_header">
                      <span>Working hours per day</span>
                      <strong>{renderEditableValue(role.id, "hours", input.hours, 0, 12, 1, formatNumber)}</strong>
                    </div>
                    <input type="range" min="0" max="12" step="1" value={input.hours} onChange={(e) => updateRoleInput(role.id, "hours", Number(e.target.value))} />
                  </label>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

export default ROICalculator;
