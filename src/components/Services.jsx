import { useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useShouldAnimate } from "../hooks/useShouldAnimate";
import { useTextReveal } from "../hooks/useTextReveal";
import "./Services.css";

/* ══ Toast ══ */
function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);
  return { toast, show };
}
function Toast({ toast }) {
  if (!toast) return null;
  return <div className={`cora_toast cora_toast--${toast.type}`}>{toast.type === "success" ? "✓" : "ℹ"} {toast.msg}</div>;
}

/* ══ Modal ══ */
function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="cora_modal_overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cora_modal">
        <div className="cora_modal_header">
          <h4 className="cora_modal_title">{title}</h4>
          <button className="cora_modal_close" onClick={onClose}>✕</button>
        </div>
        <div className="cora_modal_body">{children}</div>
        {footer && <div className="cora_modal_footer">{footer}</div>}
      </div>
    </div>
  );
}

/* ══ Shared micro-components ══ */
function Pill({ children, color = "default" }) {
  return <span className={`cora_pill cora_pill--${color}`}>{children}</span>;
}
function Btn({ children, variant = "primary", small, onClick, disabled }) {
  return <button disabled={disabled} className={`cora_btn cora_btn--${variant}${small ? " cora_btn--sm" : ""}`} onClick={onClick}>{children}</button>;
}
function SubTabs({ tabs, active, onSelect }) {
  return (
    <div className="cora_subtabs">
      {tabs.map((t) => (
        <button key={t} className={`cora_subtab${active === t ? " cora_subtab--active" : ""}`} onClick={() => onSelect(t)}>{t}</button>
      ))}
    </div>
  );
}
function EmptyTable({ message = "No records found.", icon }) {
  return (
    <tr><td colSpan={20}>
      <div className="cora_empty_table">
        <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.4" width="32" height="32">
          {icon || <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></>}
        </svg>
        <span>{message}</span>
      </div>
    </td></tr>
  );
}
function FormField({ label, type = "text", placeholder, options }) {
  return (
    <div className="cora_form_field">
      <label className="cora_form_label">{label}</label>
      {options ? (
        <select className="cora_form_input">
          <option value="">Select...</option>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} className="cora_form_input" placeholder={placeholder} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MEMBERS PANEL
═══════════════════════════════════════════ */
const MOCK_MEMBERS = [
  { id: "M-10024", name: "Dela Cruz, Juan M.", type: "Regular", contact: "0917-555-1234", status: "Active", loans: "2", savings: "₱ 12,450.00", share: "₱ 50,000.00", joined: "Oct 12, 2023" },
  { id: "M-10025", name: "Santos, Maria C.", type: "Regular", contact: "0918-222-5678", status: "Active", loans: "1", savings: "₱ 8,300.00", share: "₱ 25,000.00", joined: "Nov 05, 2023" },
  { id: "M-10026", name: "Reyes, Antonio B.", type: "Associate", contact: "0920-111-9876", status: "Inactive", loans: "0", savings: "₱ 1,200.00", share: "₱ 5,000.00", joined: "Jan 18, 2024" },
  { id: "M-10027", name: "Bautista, Elena R.", type: "Regular", contact: "0999-888-4321", status: "Active", loans: "3", savings: "₱ 45,600.00", share: "₱ 120,000.00", joined: "Feb 22, 2022" },
  { id: "M-10028", name: "Garcia, Jose P.", type: "Institutional", contact: "0915-444-9999", status: "Active", loans: "1", savings: "₱ 210,000.00", share: "₱ 500,000.00", joined: "Mar 01, 2021" },
];

function MembersPanel() {
  const { toast, show } = useToast();
  const [filter, setFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div className="cora_panel" style={{position:"relative"}}>
      <Toast toast={toast} />
      <div className="cora_panel_topbar">
        <div>
          <h3 className="cora_panel_title">Members Management</h3>
          <p className="cora_panel_sub">Organize member records, approvals, and account lifecycle in one place.</p>
        </div>
        <div className="cora_panel_actions" style={{position:"relative"}}>
          <div style={{position:"relative"}}>
            <Btn variant="outline" small onClick={() => setExportOpen(!exportOpen)}>⬆ Import / Export ▾</Btn>
            {exportOpen && (
              <div className="cora_dropdown">
                <button className="cora_dropdown_item" onClick={() => { show("Importing CSV…"); setExportOpen(false); }}>📥 Import CSV</button>
                <button className="cora_dropdown_item" onClick={() => { show("Exporting CSV…"); setExportOpen(false); }}>📤 Export CSV</button>
                <button className="cora_dropdown_item" onClick={() => { show("Exporting PDF…"); setExportOpen(false); }}>📄 Export PDF</button>
              </div>
            )}
          </div>
          <Btn variant="ghost" small onClick={() => setApprovalOpen(true)}>Approval Logs</Btn>
          <Btn variant="primary" small onClick={() => setAddOpen(true)}>+ Add Member</Btn>
        </div>
      </div>

      <div className="cora_search_row">
        <div className="cora_search_wrap">
          <svg viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="5.5" stroke="#9ca3af" strokeWidth="1.5"/><path d="M13 13l3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input className="cora_search" placeholder="Search by name, ID, TIN, email, or employee ID…" />
        </div>
        <select className="cora_select"><option>All Members</option></select>
        <select className="cora_select"><option>All Types</option></select>
        <select className="cora_select"><option>All</option></select>
        <Btn variant="ghost" small onClick={() => show("Filters reset.", "info")}>↺ Reset</Btn>
        <Btn variant="ghost" small onClick={() => show("Refreshed.", "info")}>↺ Refresh</Btn>
      </div>

      <div className="cora_stat_row">
        {[["Total Members","1,245"],["Active Members","1,180","green"],["Loans","842","orange"],["Savings Accounts","1,105","blue"]].map(([label,value,c])=>(
          <div key={label} className={`cora_stat_card${c?" cora_stat_card--"+c:""}`}>
            <span className="cora_stat_card_label">{label}</span>
            <span className="cora_stat_card_value">{value}</span>
          </div>
        ))}
      </div>

      <div className="cora_filter_tabs">
        {[["All",1245],["Regular",890],["Associate",350],["Institutional",5]].map(([label,count])=>(
          <button key={label} className={`cora_filter_tab${filter===label?" cora_filter_tab--active":""}`} onClick={()=>setFilter(label)}>
            {label} <span className="cora_filter_count">{count}</span>
          </button>
        ))}
      </div>

      <div className="cora_table_section">
        <div className="cora_table_info">
          <strong>All Members</strong>
          <span className="cora_table_hint">1,245 results • Click a row to open member details</span>
        </div>
        <div className="cora_table_wrap">
          <table className="cora_table">
            <thead><tr>
              <th style={{width:28}}><input type="checkbox"/></th>
              <th>ID ↕</th><th>MEMBER ↑</th><th>TYPE ↕</th><th>CONTACT</th>
              <th>STATUS ↕</th><th>LOANS ↕</th><th>SAVINGS ↕</th><th>PAID-UP CAPITAL ↕</th><th>JOINED ↕</th><th>ACTIONS</th>
            </tr></thead>
            <tbody>
              {MOCK_MEMBERS.map(m => (
                <tr key={m.id}>
                  <td><input type="checkbox"/></td>
                  <td><strong>{m.id}</strong></td>
                  <td>{m.name}</td>
                  <td>{m.type}</td>
                  <td>{m.contact}</td>
                  <td><Pill color={m.status === "Active" ? "green" : "default"}>{m.status}</Pill></td>
                  <td>{m.loans}</td>
                  <td>{m.savings}</td>
                  <td>{m.share}</td>
                  <td>{m.joined}</td>
                  <td><Btn variant="ghost" small onClick={() => show("Viewing member...")}>View</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Add New Member"
        footer={<><Btn variant="outline" onClick={()=>setAddOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={()=>{setAddOpen(false);show("Member added successfully!");}}> Save Member</Btn></>}>
        <div className="cora_form_grid">
          <FormField label="Full Name" placeholder="Last, First Middle" />
          <FormField label="Member ID" placeholder="e.g. M-0001" />
          <FormField label="Email Address" type="email" placeholder="member@email.com" />
          <FormField label="Contact Number" placeholder="09XX XXX XXXX" />
          <FormField label="Member Type" options={["Regular","Associate","Institutional"]} />
          <FormField label="Date Joined" type="date" />
        </div>
      </Modal>

      {/* Approval Logs Modal */}
      <Modal open={approvalOpen} onClose={()=>setApprovalOpen(false)} title="Approval Logs"
        footer={<Btn variant="outline" onClick={()=>setApprovalOpen(false)}>Close</Btn>}>
        <div className="cora_empty_state" style={{padding:"32px 0"}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.4" width="36" height="36"><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
          <span>No approval actions recorded yet.</span>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════
   SAVINGS PANEL
═══════════════════════════════════════════ */
function SavingsPanel() {
  const { toast, show } = useToast();
  const [subtab, setSubtab] = useState("Overview");

  const SUBTAB_CONTENT = {
    "Overview": (
      <div className="cora_savings_grid">
        <div className="cora_stat_row">
          <div className="cora_stat_card cora_stat_card--bigblue"><span className="cora_stat_card_label">TOTAL REGULAR SAVINGS</span><span className="cora_stat_card_value">₱ 4,520,000.00</span><span className="cora_stat_card_note">35% of total portfolio</span></div>
          <div className="cora_stat_card cora_stat_card--biggreen"><span className="cora_stat_card_label">TOTAL SHARE CAPITAL</span><span className="cora_stat_card_value">₱ 8,380,000.00</span><span className="cora_stat_card_note">65% of total portfolio</span></div>
          <div className="cora_stat_card"><span className="cora_stat_card_label">ACTIVE ACCOUNTS</span><span className="cora_stat_card_value">1,150</span><span className="cora_stat_card_note">Total open savings accounts</span></div>
          <div className="cora_stat_card"><span className="cora_stat_card_label">TOTAL MEMBERS</span><span className="cora_stat_card_value">1,105</span><span className="cora_stat_card_note">Members with active savings</span></div>
        </div>
        <div className="cora_savings_bottom">
          <div className="cora_portfolio_card">
            <div className="cora_card_section_title">PORTFOLIO DISTRIBUTION</div>
            <div className="cora_portfolio_total">₱ 12,900,000.00</div>
            <div className="cora_portfolio_sub">TOTAL ASSETS UNDER MANAGEMENT</div>
            <div className="cora_progress_bar"><div className="cora_progress_fill" style={{width:"65%"}}><span></span></div></div>
            <div className="cora_legend_row">
              <div className="cora_legend_item"><span className="cora_legend_dot" style={{background:"#2563eb"}}/>Regular Savings<br/><small>₱ 4,520,000.00</small></div>
              <div className="cora_legend_item"><span className="cora_legend_dot" style={{background:"#16a34a"}}/>Share Capital<br/><small>₱ 8,380,000.00</small></div>
            </div>
            <div className="cora_card_section_title" style={{marginTop:20}}>RECENT ACTIVITY</div>
            <div className="cora_recent_list" style={{display:"flex",flexDirection:"column",gap:16,marginTop:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13.5,alignItems:"center"}}>
                <div><strong>Deposit - Regular Savings</strong><br/><span style={{color:"#16a34a",fontWeight:600}}>+ ₱ 1,500.00</span></div>
                <div className="cora_muted" style={{textAlign:"right"}}>Santos, Maria<br/>Today, 10:24 AM</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13.5,alignItems:"center"}}>
                <div><strong>Withdrawal - Regular</strong><br/><span style={{color:"#dc2626",fontWeight:600}}>- ₱ 5,000.00</span></div>
                <div className="cora_muted" style={{textAlign:"right"}}>Reyes, Antonio<br/>Today, 09:15 AM</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13.5,alignItems:"center"}}>
                <div><strong>Share Capital Build-up</strong><br/><span style={{color:"#16a34a",fontWeight:600}}>+ ₱ 2,000.00</span></div>
                <div className="cora_muted" style={{textAlign:"right"}}>Dela Cruz, Juan<br/>Yesterday</div>
              </div>
            </div>
          </div>
          <div className="cora_pulse_col">
            <div className="cora_white_card">
              <div className="cora_card_section_title">THIS MONTH'S PULSE</div>
              <div className="cora_pulse_item cora_pulse_item--green"><div className="cora_pulse_icon cora_pulse_icon--green">↑</div><div><div className="cora_pulse_type">INFLOW</div><div className="cora_pulse_amount">₱ 452,000.00</div></div></div>
              <div className="cora_pulse_item cora_pulse_item--red"><div className="cora_pulse_icon cora_pulse_icon--red">↓</div><div><div className="cora_pulse_type">OUTFLOW</div><div className="cora_pulse_amount">₱ 120,500.00</div></div></div>
              <div className="cora_net_growth"><div className="cora_card_section_title">NET GROWTH</div><div className="cora_net_amount" style={{color:"#16a34a"}}>+ ₱ 331,500.00</div></div>
            </div>
            <div className="cora_white_card" style={{marginTop:10}}>
              <div className="cora_card_section_title">PRODUCTS</div>
              <ul style={{fontSize:13.5,color:"#374151",paddingLeft:16,marginTop:12,lineHeight:1.6}}>
                <li><strong>Regular Savings</strong> (2% p.a.)</li>
                <li><strong>Share Capital</strong> (Dividend-based)</li>
                <li><strong>Time Deposit</strong> (4.5% p.a.)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    "Members": (<div className="cora_inner_section"><div className="cora_table_wrap"><table className="cora_table"><thead><tr><th>MEMBER</th><th>ACCOUNT NO.</th><th>BALANCE</th><th>STATUS</th></tr></thead><tbody><tr><td>Santos, Maria C.</td><td>RS-2023-001</td><td>₱ 8,300.00</td><td><Pill color="green">Active</Pill></td></tr><tr><td>Dela Cruz, Juan M.</td><td>RS-2023-002</td><td>₱ 12,450.00</td><td><Pill color="green">Active</Pill></td></tr><tr><td>Reyes, Antonio B.</td><td>RS-2024-001</td><td>₱ 1,200.00</td><td><Pill color="default">Dormant</Pill></td></tr></tbody></table></div></div>),
    "Savings Products": (<div className="cora_inner_section"><div className="cora_section_header_row"><h4 className="cora_section_h4">Savings Products</h4><Btn variant="primary" small onClick={()=>show("Create product form coming soon.", "info")}>+ Create Product</Btn></div><div className="cora_table_wrap" style={{marginTop:12}}><table className="cora_table"><thead><tr><th>PRODUCT NAME</th><th>INTEREST RATE</th><th>TYPE</th><th>STATUS</th></tr></thead><tbody><tr><td>Regular Savings</td><td>2.00% p.a.</td><td>Withdrawable</td><td><Pill color="green">Active</Pill></td></tr><tr><td>Share Capital</td><td>Dividend Based</td><td>Locked</td><td><Pill color="green">Active</Pill></td></tr><tr><td>Time Deposit</td><td>4.50% p.a.</td><td>Locked (360 days)</td><td><Pill color="green">Active</Pill></td></tr></tbody></table></div></div>),
    "Interest Engine": (<div className="cora_inner_section"><div className="cora_info_box"><strong>Interest Engine</strong><p>Automatically compute and post interest to member savings accounts based on configured savings products. Set your interest frequency and rate to get started.</p></div><div className="cora_centered" style={{padding:"24px 0"}}><Btn variant="primary" onClick={()=>show("Interest engine configured.", "info")}>Configure Interest Engine</Btn></div></div>),
    "Alerts": (<div className="cora_inner_section"><div className="cora_empty_state" style={{padding:"40px 0"}}><svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.4" width="36" height="36"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span>No alerts at this time.</span></div></div>),
  };

  return (
    <div className="cora_panel" style={{position:"relative"}}>
      <Toast toast={toast} />
      <div className="cora_panel_topbar">
        <div><h3 className="cora_panel_title">Savings Management</h3><p className="cora_panel_sub">Select a member to view and manage their savings accounts.</p></div>
        <div className="cora_panel_actions">
          <Btn variant="outline" small onClick={()=>show("Exporting savings data…")}>⬇ Export ▾</Btn>
          <Btn variant="primary" small onClick={()=>show("Import template downloaded.", "info")}>⬆ Import ▾</Btn>
        </div>
      </div>
      <SubTabs tabs={["Overview","Members","Savings Products","Interest Engine","Alerts"]} active={subtab} onSelect={setSubtab} />
      {SUBTAB_CONTENT[subtab]}
    </div>
  );
}

/* ══════════════════════════════════════════
   LOANS PANEL
═══════════════════════════════════════════ */
function LoansPanel() {
  const { toast, show } = useToast();
  const [subtab, setSubtab] = useState("Loan Products");
  const [createOpen, setCreateOpen] = useState(false);

  const TAB_CONTENT = {
    "Loan Products": (
      <div className="cora_inner_section">
        <div className="cora_search_row" style={{padding:"10px 0"}}>
          <div className="cora_search_wrap"><svg viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="5.5" stroke="#9ca3af" strokeWidth="1.5"/><path d="M13 13l3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg><input className="cora_search" placeholder="Search products…"/></div>
          <span className="cora_muted" style={{marginLeft:"auto",whiteSpace:"nowrap"}}>3 products</span>
          <Btn variant="ghost" small onClick={()=>show("Refreshed.","info")}>↺</Btn>
          <Btn variant="primary" small onClick={()=>setCreateOpen(true)}>+ Create Product</Btn>
        </div>
        <div className="cora_table_wrap"><table className="cora_table"><thead><tr><th>PRODUCT ID ↕</th><th>PRODUCT NAME ↑</th><th>INTEREST RATE ↕</th><th>AMOUNT RANGE ↕</th><th>MAX TERM ↕</th><th>FREQUENCY ↕</th><th>METHOD</th><th>SERVICE</th></tr></thead>
          <tbody>
            <tr><td>LP-001</td><td><strong>Regular Loan</strong></td><td>12.00% p.a.</td><td>₱ 5,000 - ₱ 500k</td><td>36 mos</td><td>Monthly</td><td>Diminishing</td><td>1.0%</td></tr>
            <tr><td>LP-002</td><td><strong>Providential Loan</strong></td><td>10.00% p.a.</td><td>₱ 1,000 - ₱ 50k</td><td>12 mos</td><td>Monthly</td><td>Straight-Line</td><td>1.5%</td></tr>
            <tr><td>LP-003</td><td><strong>Business Loan</strong></td><td>14.00% p.a.</td><td>₱ 50k - ₱ 2M</td><td>60 mos</td><td>Monthly</td><td>Diminishing</td><td>2.0%</td></tr>
          </tbody>
        </table></div>
      </div>
    ),
    "Create Application": (
      <div className="cora_inner_section">
        <h4 className="cora_section_h4" style={{marginBottom:12}}>New Loan Application</h4>
        <div className="cora_form_grid">
          <FormField label="Member" placeholder="Search member name or ID…"/>
          <FormField label="Loan Product" options={["Educational Loan","Petty Cash Loan","Regular Loan"]}/>
          <FormField label="Loan Amount" placeholder="₱ 0.00"/>
          <FormField label="Term (months)" placeholder="e.g. 12"/>
          <FormField label="Purpose" placeholder="Brief description…"/>
          <FormField label="Application Date" type="date"/>
        </div>
        <div className="cora_panel_actions" style={{marginTop:16}}>
          <Btn variant="outline" onClick={()=>show("Draft saved.","info")}>Save Draft</Btn>
          <Btn variant="primary" onClick={()=>show("Application submitted for approval!")}>Submit Application</Btn>
        </div>
      </div>
    ),
    "Pending Applications": (<div className="cora_inner_section"><div className="cora_table_wrap"><table className="cora_table"><thead><tr><th>APP ID</th><th>MEMBER</th><th>PRODUCT</th><th>AMOUNT</th><th>DATE</th><th>ACTIONS</th></tr></thead><tbody>
      <tr><td><strong>APP-4091</strong></td><td>Lim, Christopher</td><td>Business Loan</td><td>₱ 150,000.00</td><td>2 hrs ago</td><td><Btn variant="ghost" small onClick={()=>show("Viewing application...")}>Review</Btn></td></tr>
      <tr><td><strong>APP-4090</strong></td><td>Garcia, Ana</td><td>Regular Loan</td><td>₱ 30,000.00</td><td>5 hrs ago</td><td><Btn variant="ghost" small onClick={()=>show("Viewing application...")}>Review</Btn></td></tr>
    </tbody></table></div></div>),
    "Approved Applications": (<div className="cora_inner_section"><div className="cora_table_wrap"><table className="cora_table"><thead><tr><th>APP ID</th><th>MEMBER</th><th>PRODUCT</th><th>AMOUNT</th><th>APPROVED BY</th><th>ACTIONS</th></tr></thead><tbody>
      <tr><td><strong>APP-4089</strong></td><td>Reyes, Antonio B.</td><td>Providential Loan</td><td>₱ 15,000.00</td><td>Credit Comm.</td><td><Btn variant="primary" small onClick={()=>show("Disbursement form opened.")}>Disburse</Btn></td></tr>
    </tbody></table></div></div>),
    "All Applications": (<div className="cora_inner_section"><div className="cora_table_wrap"><table className="cora_table"><thead><tr><th>APP ID</th><th>MEMBER</th><th>PRODUCT</th><th>AMOUNT</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>
      <tr><td><strong>APP-4088</strong></td><td>Dela Cruz, Juan M.</td><td>Regular Loan</td><td>₱ 50,000.00</td><td><Pill color="green">Disbursed</Pill></td><td><Btn variant="ghost" small onClick={()=>show("Viewing application...")}>View</Btn></td></tr>
      <tr><td><strong>APP-4087</strong></td><td>Santos, Maria C.</td><td>Regular Loan</td><td>₱ 150,000.00</td><td><Pill color="red">Rejected</Pill></td><td><Btn variant="ghost" small onClick={()=>show("Viewing application...")}>View</Btn></td></tr>
    </tbody></table></div></div>),
    "Active Loans": (<div className="cora_inner_section"><div className="cora_table_wrap"><table className="cora_table"><thead><tr><th>LOAN ID</th><th>MEMBER</th><th>BALANCE</th><th>NEXT DUE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>
      <tr><td><strong>LN-2023-112</strong></td><td>Dela Cruz, Juan M.</td><td>₱ 38,450.00</td><td>Jun 30, 2026</td><td><Pill color="green">Current</Pill></td><td><Btn variant="ghost" small onClick={()=>show("Viewing loan...")}>View</Btn></td></tr>
      <tr><td><strong>LN-2023-098</strong></td><td>Santos, Maria C.</td><td>₱ 12,200.00</td><td>Jun 15, 2026</td><td><Pill color="red">Past Due</Pill></td><td><Btn variant="ghost" small onClick={()=>show("Viewing loan...")}>View</Btn></td></tr>
    </tbody></table></div></div>),
  };

  return (
    <div className="cora_panel" style={{position:"relative"}}>
      <Toast toast={toast} />
      <div className="cora_panel_topbar">
        <div><h3 className="cora_panel_title">Loan Management</h3><p className="cora_panel_sub">Manage loan products, applications, and disbursements.</p></div>
        <div className="cora_panel_actions">
          <Btn variant="outline" small onClick={()=>show("Exporting loan data…")}>⬇ Export ▾</Btn>
          <Btn variant="primary" small onClick={()=>show("Import template downloaded.","info")}>⬆ Import ▾</Btn>
        </div>
      </div>
      <SubTabs tabs={["Loan Products","Create Application","Pending Applications","Approved Applications","All Applications","Active Loans"]} active={subtab} onSelect={setSubtab}/>
      {TAB_CONTENT[subtab]}

      <Modal open={createOpen} onClose={()=>setCreateOpen(false)} title="Create Loan Product"
        footer={<><Btn variant="outline" onClick={()=>setCreateOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={()=>{setCreateOpen(false);show("Loan product created!");}}>Save Product</Btn></>}>
        <div className="cora_form_grid">
          <FormField label="Product Name" placeholder="e.g. Regular Loan"/>
          <FormField label="Interest Rate (%)" placeholder="e.g. 10.00"/>
          <FormField label="Min Amount (₱)" placeholder="e.g. 1000"/>
          <FormField label="Max Amount (₱)" placeholder="e.g. 500000"/>
          <FormField label="Max Term (months)" placeholder="e.g. 36"/>
          <FormField label="Frequency" options={["Monthly","Quarterly","Semi-Annual","Annual"]}/>
          <FormField label="Method" options={["Diminishing","Straight-Line"]}/>
          <FormField label="Service Fee (%)" placeholder="e.g. 1.00"/>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════
   ACCOUNTING PANEL
═══════════════════════════════════════════ */
function AccountingPanel() {
  const { toast, show } = useToast();
  const [subtab, setSubtab] = useState("Accounting Periods");
  const [periodStatus, setPeriodStatus] = useState("OPEN");
  const [closeConfirm, setCloseConfirm] = useState(false);
  const [createPeriod, setCreatePeriod] = useState(false);

  const TAB_CONTENT = {
    "Accounting Periods": (
      <div className="cora_inner_section">
        <div className="cora_section_header_row">
          <div><h4 className="cora_section_h4">Accounting Periods</h4><p className="cora_panel_sub">Manage accounting period locks to prevent posting to closed periods.</p></div>
          <div className="cora_panel_actions">
            <Btn variant="outline" small onClick={()=>show("Exporting periods…")}>⬇ Export ▾</Btn>
            <Btn variant="primary" small onClick={()=>setCreatePeriod(true)}>+ Create Period</Btn>
          </div>
        </div>
        <div className="cora_info_box">
          <strong>About Accounting Periods</strong>
          <p>Accounting periods allow you to lock transaction posting for specific date ranges. When a period is closed, no transactions can be created or modified with dates falling within that period.</p>
          <p><strong>Important:</strong> Periods must be closed in chronological order.</p>
        </div>
        <div className="cora_white_card" style={{marginTop:12}}>
          <div className="cora_table_info"><strong>Periods</strong></div>
          <table className="cora_table">
            <thead><tr><th>PERIOD NAME</th><th>START DATE</th><th>END DATE</th><th>STATUS</th><th>CLOSED BY</th><th>CLOSED AT</th><th>ACTIONS</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>FY 2026</strong></td>
                <td>Jan 1, 2026</td><td>Dec 31, 2026</td>
                <td><Pill color={periodStatus==="OPEN"?"green-outline":"red-outline"}>{periodStatus}</Pill></td>
                <td className="cora_muted">{periodStatus==="CLOSED"?"System":"-"}</td>
                <td className="cora_muted">{periodStatus==="CLOSED"?"Jun 9, 2026":"-"}</td>
                <td>
                  {periodStatus==="OPEN"
                    ? <Btn variant="danger-outline" small onClick={()=>setCloseConfirm(true)}>Close Period</Btn>
                    : <Btn variant="ghost" small onClick={()=>{setPeriodStatus("OPEN");show("Period reopened.","info");}}>Reopen</Btn>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    "Chart of Accounts": (<div className="cora_inner_section"><div className="cora_section_header_row"><h4 className="cora_section_h4">Chart of Accounts</h4><Btn variant="primary" small onClick={()=>show("Account created!","info")}>+ Add Account</Btn></div><div className="cora_table_wrap" style={{marginTop:12}}><table className="cora_table"><thead><tr><th>CODE</th><th>ACCOUNT NAME</th><th>TYPE</th><th>BALANCE</th><th>ACTIONS</th></tr></thead><tbody>
      <tr><td>1010</td><td><strong>Cash in Bank - BDO</strong></td><td>Asset</td><td>₱ 2,450,000.00</td><td><Btn variant="ghost" small onClick={()=>show("Viewing account...")}>View</Btn></td></tr>
      <tr><td>1020</td><td><strong>Loans Receivable - Regular</strong></td><td>Asset</td><td>₱ 8,120,500.00</td><td><Btn variant="ghost" small onClick={()=>show("Viewing account...")}>View</Btn></td></tr>
      <tr><td>2010</td><td><strong>Savings Deposit Payable</strong></td><td>Liability</td><td>₱ 4,520,000.00</td><td><Btn variant="ghost" small onClick={()=>show("Viewing account...")}>View</Btn></td></tr>
      <tr><td>3010</td><td><strong>Paid-up Share Capital</strong></td><td>Equity</td><td>₱ 8,380,000.00</td><td><Btn variant="ghost" small onClick={()=>show("Viewing account...")}>View</Btn></td></tr>
    </tbody></table></div></div>),
    "General Ledger": (<div className="cora_inner_section"><div className="cora_table_wrap"><table className="cora_table"><thead><tr><th>DATE</th><th>REF NO.</th><th>DESCRIPTION</th><th>DEBIT</th><th>CREDIT</th><th>BALANCE</th></tr></thead><tbody>
      <tr><td>Jun 18, 2026</td><td>JE-2026-0618</td><td>Daily Collection Summary</td><td>₱ 45,200.00</td><td>-</td><td>₱ 2,495,200.00</td></tr>
      <tr><td>Jun 17, 2026</td><td>JE-2026-0617</td><td>Loan Disbursement - APP-4085</td><td>-</td><td>₱ 50,000.00</td><td>₱ 2,450,000.00</td></tr>
    </tbody></table></div></div>),
    "Subsidiary Ledger": (<div className="cora_inner_section"><div className="cora_table_wrap"><table className="cora_table"><thead><tr><th>MEMBER</th><th>ACCOUNT</th><th>DATE</th><th>DEBIT</th><th>CREDIT</th><th>BALANCE</th></tr></thead><tbody>
      <tr><td>Santos, Maria C.</td><td>RS-2023-001</td><td>Jun 18, 2026</td><td>-</td><td>₱ 1,500.00</td><td>₱ 8,300.00</td></tr>
      <tr><td>Dela Cruz, Juan M.</td><td>LN-2023-112</td><td>Jun 17, 2026</td><td>-</td><td>₱ 2,500.00</td><td>₱ 38,450.00</td></tr>
    </tbody></table></div></div>),
    "Journal Entries": (<div className="cora_inner_section"><div className="cora_section_header_row"><h4 className="cora_section_h4">Journal Entries</h4><Btn variant="primary" small onClick={()=>show("Journal entry form opened.","info")}>+ New Entry</Btn></div><div className="cora_table_wrap" style={{marginTop:12}}><table className="cora_table"><thead><tr><th>ENTRY NO.</th><th>DATE</th><th>DESCRIPTION</th><th>DEBIT</th><th>CREDIT</th><th>STATUS</th></tr></thead><tbody>
      <tr><td><strong>JE-2026-0618</strong></td><td>Jun 18, 2026</td><td>Daily Collection Summary</td><td>₱ 45,200.00</td><td>₱ 45,200.00</td><td><Pill color="green">Posted</Pill></td></tr>
      <tr><td><strong>JE-2026-0617</strong></td><td>Jun 17, 2026</td><td>Loan Disbursement - APP-4085</td><td>₱ 50,000.00</td><td>₱ 50,000.00</td><td><Pill color="green">Posted</Pill></td></tr>
    </tbody></table></div></div>),
    "Vouchers": (<div className="cora_inner_section"><div className="cora_table_wrap"><table className="cora_table"><thead><tr><th>VOUCHER NO.</th><th>DATE</th><th>PAYEE</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>
      <tr><td><strong>CV-2026-101</strong></td><td>Jun 17, 2026</td><td>Reyes, Antonio B.</td><td>₱ 15,000.00</td><td><Pill color="green">Cleared</Pill></td></tr>
    </tbody></table></div></div>),
    "Account Mapping": (<div className="cora_inner_section"><div className="cora_info_box"><strong>Account Mapping <span style={{background:"#dbeafe",color:"#1d4ed8",fontSize:"9px",padding:"2px 6px",borderRadius:"4px",marginLeft:4}}>NEW</span></strong><p>Map your cooperative's transaction types to their corresponding chart of accounts entries. This ensures accurate automated journal entries.</p></div><div className="cora_centered" style={{padding:"20px 0"}}><Btn variant="primary" onClick={()=>show("Account mapping saved!","info")}>Configure Mapping</Btn></div></div>),
  };

  return (
    <div className="cora_panel" style={{position:"relative"}}>
      <Toast toast={toast} />
      <div className="cora_panel_topbar">
        <div><h3 className="cora_panel_title">Core Accounting</h3><p className="cora_panel_sub">Open each tab to work directly with live accounting data and reports.</p></div>
      </div>
      <SubTabs tabs={["Accounting Periods","Chart of Accounts","General Ledger","Subsidiary Ledger","Journal Entries","Vouchers","Account Mapping"]} active={subtab} onSelect={setSubtab}/>
      {TAB_CONTENT[subtab]}

      <Modal open={closeConfirm} onClose={()=>setCloseConfirm(false)} title="Close Accounting Period"
        footer={<><Btn variant="outline" onClick={()=>setCloseConfirm(false)}>Cancel</Btn><Btn variant="danger-outline" onClick={()=>{setPeriodStatus("CLOSED");setCloseConfirm(false);show("FY 2026 period closed.");}}> Yes, Close Period</Btn></>}>
        <p style={{fontSize:13,lineHeight:1.6,color:"#374151"}}>Are you sure you want to close <strong>FY 2026</strong> (Jan 1, 2026 – Dec 31, 2026)?<br/>No transactions can be posted to this period after it is closed.</p>
      </Modal>
      <Modal open={createPeriod} onClose={()=>setCreatePeriod(false)} title="Create Accounting Period"
        footer={<><Btn variant="outline" onClick={()=>setCreatePeriod(false)}>Cancel</Btn><Btn variant="primary" onClick={()=>{setCreatePeriod(false);show("Accounting period created!");}}>Create Period</Btn></>}>
        <div className="cora_form_grid">
          <FormField label="Period Name" placeholder="e.g. FY 2027"/>
          <FormField label="Start Date" type="date"/>
          <FormField label="End Date" type="date"/>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════
   REPORTS PANEL
═══════════════════════════════════════════ */
function ReportsPanel() {
  const { toast, show } = useToast();
  const [subtab, setSubtab] = useState("Collections");
  const [warning, setWarning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); show("Report refreshed.","info"); }, 1200);
  };

  const REPORT_TABS = ["Collections","Members","Savings","Loans","Aging","Delinquency","Financial","Balance Sheet","Income"];

  const REPORT_CONTENT = {
    "Collections": (
      <>
        <div className="cora_stat_row" style={{marginTop:8}}>
          {[["Total Collections","₱ 45,200.00","34 payments","report-blue"],["Loan Payments","₱ 32,500.00","18 payments","report-green"],["Membership Fees","₱ 1,200.00","4 payments","report-purple"],["Other Collections","₱ 11,500.00","12 payments",""]].map(([label,value,note,c])=>(
            <div key={label} className={`cora_stat_card${c?" cora_stat_card--"+c:""}`}>
              <span className="cora_stat_card_label">{label}</span>
              <span className="cora_stat_card_value">{value}</span>
              <span className="cora_stat_card_note">{note}</span>
            </div>
          ))}
        </div>
        <div className="cora_payment_methods_label">Payment Methods</div>
        <div className="cora_centered">
          <Btn variant="dark" onClick={()=>setShowDetails(!showDetails)}>{showDetails ? "Hide Detailed Payments" : "Show Detailed Payments"}</Btn>
        </div>
        {showDetails && (
          <div className="cora_table_wrap" style={{marginTop:10}}>
            <table className="cora_table">
              <thead><tr><th>METHOD</th><th>TRANSACTION COUNT</th><th>TOTAL AMOUNT</th></tr></thead>
              <tbody>
                <tr><td>Cash (Over-the-counter)</td><td>14</td><td>₱ 18,500.00</td></tr>
                <tr><td>Bank Transfer (BDO)</td><td>12</td><td>₱ 20,200.00</td></tr>
                <tr><td>GCash</td><td>8</td><td>₱ 6,500.00</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </>
    ),
    "Members": (
      <div className="cora_table_wrap" style={{marginTop:12}}>
        <table className="cora_table"><thead><tr><th>MEMBER TYPE</th><th>NEW MEMBERS</th><th>TOTAL ACTIVE</th><th>RESIGNED</th></tr></thead><tbody>
          <tr><td><strong>Regular</strong></td><td>12</td><td>890</td><td>2</td></tr>
          <tr><td><strong>Associate</strong></td><td>5</td><td>350</td><td>0</td></tr>
          <tr><td><strong>Institutional</strong></td><td>0</td><td>5</td><td>0</td></tr>
        </tbody></table>
      </div>
    ),
    "Savings": (
      <div className="cora_table_wrap" style={{marginTop:12}}>
        <table className="cora_table"><thead><tr><th>SAVINGS PRODUCT</th><th>TOTAL DEPOSITS</th><th>TOTAL WITHDRAWALS</th><th>NET GROWTH</th></tr></thead><tbody>
          <tr><td><strong>Regular Savings</strong></td><td>₱ 250,000.00</td><td>₱ 85,000.00</td><td><span style={{color:"#16a34a"}}>+ ₱ 165,000.00</span></td></tr>
          <tr><td><strong>Share Capital</strong></td><td>₱ 500,000.00</td><td>₱ 0.00</td><td><span style={{color:"#16a34a"}}>+ ₱ 500,000.00</span></td></tr>
        </tbody></table>
      </div>
    ),
    "Loans": (
      <div className="cora_table_wrap" style={{marginTop:12}}>
        <table className="cora_table"><thead><tr><th>LOAN PRODUCT</th><th>DISBURSED</th><th>COLLECTED</th><th>OUTSTANDING BALANCE</th></tr></thead><tbody>
          <tr><td><strong>Regular Loan</strong></td><td>₱ 1,200,000.00</td><td>₱ 350,000.00</td><td>₱ 8,120,500.00</td></tr>
          <tr><td><strong>Providential Loan</strong></td><td>₱ 50,000.00</td><td>₱ 25,000.00</td><td>₱ 120,000.00</td></tr>
        </tbody></table>
      </div>
    ),
    "Aging": (
      <div className="cora_table_wrap" style={{marginTop:12}}>
        <table className="cora_table"><thead><tr><th>CATEGORY</th><th>AMOUNT</th><th>% OF TOTAL</th></tr></thead><tbody>
          <tr><td><strong>Current (0 days)</strong></td><td>₱ 7,500,000.00</td><td>90.0%</td></tr>
          <tr><td><strong>1 - 30 Days Past Due</strong></td><td>₱ 500,000.00</td><td>6.0%</td></tr>
          <tr><td><strong>31 - 60 Days Past Due</strong></td><td>₱ 200,000.00</td><td>2.4%</td></tr>
          <tr><td><strong>Over 90 Days</strong></td><td>₱ 133,000.00</td><td>1.6%</td></tr>
        </tbody></table>
      </div>
    ),
    "Delinquency": (
      <div className="cora_stat_row" style={{marginTop:8}}>
        <div className="cora_stat_card cora_stat_card--report-red"><span className="cora_stat_card_label">Portfolio at Risk (PAR)</span><span className="cora_stat_card_value">4.0%</span><span className="cora_stat_card_note">Acceptable range &lt; 5%</span></div>
        <div className="cora_stat_card"><span className="cora_stat_card_label">Delinquent Loans</span><span className="cora_stat_card_value">45</span><span className="cora_stat_card_note">Out of 842 total</span></div>
      </div>
    ),
    "Financial": (
      <div className="cora_empty_state" style={{marginTop:20}}><span>Select Balance Sheet or Income Statement below.</span></div>
    ),
    "Balance Sheet": (
      <div className="cora_table_wrap" style={{marginTop:12}}>
        <table className="cora_table"><thead><tr><th>ACCOUNT</th><th>ASSETS</th><th>LIABILITIES & EQUITY</th></tr></thead><tbody>
          <tr><td><strong>Total Assets</strong></td><td>₱ 12,900,000.00</td><td>-</td></tr>
          <tr><td><strong>Total Liabilities</strong></td><td>-</td><td>₱ 4,520,000.00</td></tr>
          <tr><td><strong>Total Equity</strong></td><td>-</td><td>₱ 8,380,000.00</td></tr>
          <tr style={{background:"#f3f4f6"}}><td><strong>Total</strong></td><td><strong>₱ 12,900,000.00</strong></td><td><strong>₱ 12,900,000.00</strong></td></tr>
        </tbody></table>
      </div>
    ),
    "Income": (
      <div className="cora_table_wrap" style={{marginTop:12}}>
        <table className="cora_table"><thead><tr><th>CATEGORY</th><th>AMOUNT</th></tr></thead><tbody>
          <tr><td><strong>Interest Income from Loans</strong></td><td>₱ 450,000.00</td></tr>
          <tr><td><strong>Service Fees</strong></td><td>₱ 25,000.00</td></tr>
          <tr><td><strong>Fines and Penalties</strong></td><td>₱ 5,000.00</td></tr>
          <tr style={{background:"#f3f4f6"}}><td><strong>Gross Income</strong></td><td><strong>₱ 480,000.00</strong></td></tr>
        </tbody></table>
      </div>
    )
  };

  return (
    <div className="cora_panel" style={{position:"relative"}}>
      <Toast toast={toast} />
      <div className="cora_panel_topbar">
        <div><h3 className="cora_panel_title">Reports</h3><p className="cora_panel_sub">Generate and export financial and operational reports.</p></div>
      </div>

      {warning && (
        <div className="cora_warning_banner">
          <span className="cora_warning_icon">⚠</span>
          <div>
            <strong>Data Integrity Issues Detected</strong>
            <p>Some accounts may have missing general ledger entries.</p>
            <p className="cora_warning_sub">Reports may show incomplete data. Contact your system administrator.</p>
          </div>
          <button className="cora_banner_close" onClick={()=>setWarning(false)}>✕</button>
        </div>
      )}

      <div style={{padding:"12px 16px",background:"#fff",borderBottom:"1px solid #e5e7eb"}}>
        <div className="cora_report_period_label">
          <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><rect x="3" y="4" width="14" height="13" rx="2" stroke="#6b7280" strokeWidth="1.4"/><path d="M7 2v2M13 2v2M3 8h14" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <div><div className="cora_report_period_title">REPORT PERIOD</div><div className="cora_panel_sub">Choose the date to summarize.</div></div>
        </div>
        <div className="cora_report_date_row">
          <div><label className="cora_report_date_label">DATE</label><input type="date" className="cora_date_input" defaultValue="2026-06-09"/></div>
          <Btn variant="primary" small onClick={handleRefresh} disabled={loading}>{loading ? "Refreshing…" : "↺ Refresh"}</Btn>
        </div>
      </div>

      <SubTabs tabs={REPORT_TABS} active={subtab} onSelect={setSubtab}/>

      <div className="cora_inner_section">
        <div className="cora_section_header_row">
          <div><h4 className="cora_section_h4">{subtab === "Collections" ? "Daily Collection Summary" : `${subtab} Report`}</h4><p className="cora_panel_sub">Summary for the selected period.</p></div>
          <div className="cora_panel_actions">
            <Btn variant="pdf" small onClick={()=>show("Generating PDF report…")}>📄 PDF</Btn>
            <Btn variant="excel" small onClick={()=>show("Exporting to Excel…")}>📊 Excel</Btn>
          </div>
        </div>

        {REPORT_CONTENT[subtab] || <div className="cora_empty_state" style={{marginTop:20}}><span>Report data not available.</span></div>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN SERVICES COMPONENT
═══════════════════════════════════════════ */
const TABS = [
  { id:"membership", label:"Membership", Panel:MembersPanel, icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/></svg> },
  { id:"savings",    label:"Savings",    Panel:SavingsPanel,    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
  { id:"loans",      label:"Loans",      Panel:LoansPanel,      icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> },
  { id:"accounting", label:"Accounting", Panel:AccountingPanel, icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><path d="M2 20h20"/></svg> },
  { id:"reports",    label:"Reports",    Panel:ReportsPanel,    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg> },
];

function Services() {
  const [active, setActive] = useState("membership");
  const shouldAnimate = useShouldAnimate();
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const layoutRef = useRef(null);
  const bgRef = useRef(null);
  const tab = TABS.find((t) => t.id === active);
  const ActivePanel = tab.Panel;
  const headingRef = useTextReveal({ start: "top 90%" });

  useScrollReveal(sectionRef, {}, 0.07);

  // ── Apple-style product reveal & Parallax bg ──
  useGSAP(() => {
    if (!shouldAnimate) return;
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // Background parallax scrub
      if (bgRef.current && sectionRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }


    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [shouldAnimate] });

  useGSAP(() => {
    if (!shouldAnimate || !sectionRef.current) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const tabBtns = sectionRef.current.querySelectorAll(".services_tab");
    tabBtns.forEach((btn) => {
      btn.addEventListener("mouseenter", () => gsap.to(btn, { x: 3, duration: 0.2, ease: "power1.out" }));
      btn.addEventListener("mouseleave", () => gsap.to(btn, { x: 0, duration: 0.2, ease: "power1.out" }));
    });
  }, { scope: sectionRef });

  useGSAP(() => {
    if (!shouldAnimate || !panelRef.current) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    requestAnimationFrame(() => {
      if (!panelRef.current) return;
      const outgoingX = isMobile ? -3 : -6;
      const dur = isMobile ? 0.22 : 0.32;
      gsap.fromTo(panelRef.current,
        { opacity: 0.5, x: outgoingX },
        { opacity: 1, x: 0, duration: dur, ease: "power3.out" }
      );
    });
  }, { scope: sectionRef, dependencies: [active] });

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="services_parallax_bg" ref={bgRef} aria-hidden="true" />
      <div className="services_inner">
        <p className="services_eyebrow reveal">A Glimpse into CORA</p>
        <h2 className="services_heading" ref={headingRef}>This is just 10% of what CORA can actually do.</h2>
        <p className="services_sub reveal" style={{ marginBottom: "8px", fontWeight: "600", color: "#163015" }}>
          This preview just scratches the surface. Behind this clean design is a powerful software that handles all your cooperative's heavy lifting.
        </p>
        <p className="services_sub reveal">
          But don't worry—it's still incredibly easy to use. No IT team needed. We can set up your entire cooperative in hours, not weeks. Click around below to see how it feels.
        </p>

        <div className="services_layout" ref={layoutRef}>
          <div className="services_tabs">
            {TABS.map((t) => (
              <button key={t.id} className={`services_tab${active===t.id?" services_tab--active":""}`} onClick={()=>setActive(t.id)}>
                <span className="services_tab_icon">{t.icon}</span>
                <span className="services_tab_label">{t.label}</span>
                <svg className="services_tab_arrow" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
          </div>
          <div className="services_panel_outer" ref={panelRef}>
            <ActivePanel key={active} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
