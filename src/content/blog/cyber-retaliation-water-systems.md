---
title: "Cyber Retaliation Risks to U.S. Water and Wastewater Systems"
description: "A geopolitical threat and risk assessment of the 2026 U.S.–Iran–Israel war, industrial controller exposure, and priorities for U.S. water utilities."
pubDate: "2026-11-08"
draft: false
---

**TLP:CLEAR · Geopolitical Threat and Risk Assessment**<br />
**Assessment date:** October 9, 2026<br />
**Forecast horizon:** October 9, 2026 to October 9, 2027

## Executive summary

U.S. water and wastewater utilities with industrial controllers exposed to the internet should make cyber disruption a high planning priority for the next twelve months. Confidence in this assessment is moderate. The risk at an individual utility depends on its access controls, process safeguards, and ability to restore service.

### Key judgments

**J1**: Further attempts against exposed controllers are likely, with moderate confidence. These attacks began before the 2026 U.S.–Iran–Israel war. However, the joint federal advisory indicates that Iranian-affiliated targeting increased, likely in response to the conflict. Its July update describes attacks on more equipment types and interference with protective functions ([Federal Bureau of Investigation et al., 2026][S02]). Public reporting supports greater targeting of an existing weakness, although it cannot establish the scope of that increase.

**J2**: Local service disruption is plausible where engineering access is exposed and independent safeguards are inadequate, with moderate confidence. Minnesota confirmed coordinated targeting of more than thirty community water systems. Clayton County reported a temporary service loss and precautionary boil-water advisory while investigating a possible cyber contribution. These incidents justify preparing for disruption, although they do not establish a shared attacker or nationwide control of water systems ([Minnesota IT Services, 2026b][S10]; [Thomas, 2026][S35]).

**J3**: A temporary military pause is unlikely to end existing cyber access or the incentive to use it, with moderate confidence. The October 8 announcement about U.S. strikes gives no evidence that attackers have lost their footholds ([Associated Press, 2026][S15]). Utilities should maintain protections until technical findings support a change.

Executives should authorize three priorities: safely remove direct controller exposure, limit privileged and provider access, and test safe operation, recovery, and public communication. Integrator time and reliable restoration deserve funding first. Managers should demonstrate that unnecessary access has been closed, remote accounts have accountable owners, and recovery works. Smaller utilities may need shared technical assistance to complete this work.

Destructive attacks on essential support systems carry a medium planning priority. Portal disruption, camera reconnaissance, and interruption of services hosted in the Gulf remain unscored contingencies. Their relevance to a particular utility needs to be established through collection and continuity exercises.

## Contents

- [Geopolitical context and scope](#geopolitical-context-and-scope)
- [Sources and methodology](#sources-and-methodology)
- [Threat actor assessment](#threat-actor-assessment)
- [Impact and risk assessment](#impact-and-risk-assessment)
- [Analytic judgments and confidence](#analytic-judgments-and-confidence)
- [Recommendations](#recommendations)
- [Appendix A · Graded source log](#appendix-a-graded-source-log)
- [Appendix B · Adversary technique mappings](#appendix-b-adversary-technique-mappings)
- [Appendix C · Full risk register and watchlist](#appendix-c-full-risk-register-and-watchlist)
- [References](#references)

## Geopolitical context and scope

This assessment considers how the U.S.–Iran–Israel war affects cyber retaliation against U.S. water and wastewater utilities. The war began on February 28, 2026, with the United States directly involved. On October 8, President Trump said U.S. strikes would not resume before the November 3 elections, after earlier negotiations had failed. That announcement leaves the longer-term conflict unresolved ([Associated Press, 2026][S15]; [U.S. Attorney's Office, District of Maryland, 2026][S03]).

The central question is how the conflict changes cyber disruption risk through October 9, 2027, and which protections executives should fund first. The focus is remotely managed operational systems and their essential support services. Utility executives are the main audience; operations managers, IT and operational technology (OT) teams, and sector coordinators implement the recommendations. Collection covers February 28–October 9, 2026, with earlier activity providing a baseline.

The war adds an incentive to exploit existing weaknesses. The federal advisory traces CyberAv3ngers' U.S. controller campaign to November 2023 and assesses an escalation in Iranian-affiliated activity during 2026. Its July revision describes targeting across more manufacturers and changes to protective functions. For utilities, this increases the urgency of securing exposed equipment. Public reporting does not provide enough consistent data to calculate an attack rate before and after the war ([Federal Bureau of Investigation et al., 2026][S02]).

Minnesota and Clayton County provide incident evidence for a sector-wide assessment. The scenarios concentrate on utilities with exposed control interfaces, shared privileged accounts, or essential services that lack tested alternatives. Those conditions are assumptions to verify locally, rather than findings about the named victims. Utilities also depend on remote maintenance, so access changes must preserve safe operation. The report uses TLP:CLEAR because its evidence is public and it contains no confidential utility configurations ([FIRST, 2022][S21]).

## Sources and methodology

Twenty-two sources include government advisories, operator disclosures, vendor research, journalism, think-tank analysis, and technical references. Government and utility notices describe observations, vendors explain attack methods, journalism establishes chronology, and strategic analysis examines incentives. EPA guidance and NIST's remote-access architecture support controls suited to water systems ([Tang et al., 2026][S37]; [U.S. Environmental Protection Agency, 2024][S36]).

Appendix A assesses source reliability and the credibility of individual claims separately. R1 means strong access to the reported observation, R2 means established reporting with partial visibility, and R3 means uncertain provenance. E1 identifies independently corroborated observations; E2, direct disclosures with limited corroboration; E3, assessed attribution or interpretation; E4, unverified claims; E5, contradicted information; and E6, insufficient information. A publisher's reputation alone does not determine the grade.

The analysis compares historical and current activity, examines intent, capability, and opportunity, and tests competing explanations. Federal findings identify an Iranian-affiliated campaign. Minnesota and Clayton County describe separate events without establishing a common attacker. Later U.S. and Canadian advisories document wider PLC targeting. Journalism, MITRE, and partner summaries repeating an advisory are not independent forensic confirmation.

Public reporting has material limitations. Utilities may disclose only part of an incident, vendors see their own customer base, and dramatic claims attract attention. Radware's opening-war sample cannot establish October's attack tempo. The review included the full Associated Press report and official releases through September, but representative exposure inventories, consistent incident totals, and recovery tests remain unavailable. Ratings apply to defined scenarios, not statistical probabilities for every utility.

Confidence describes how well the evidence supports a judgment. High confidence requires agreement between sources and few material gaps. Moderate confidence reflects credible evidence with significant uncertainty, while low confidence reflects limited or conflicting evidence. Likelihood, by contrast, concerns whether a future event is expected to occur.

## Threat actor assessment

### Iranian-affiliated OT actors and CyberAv3ngers

The main threat is the Iranian-affiliated advanced persistent threat activity described in AA26-097A. The agencies assess that these actors intend to disrupt services and that their activity has escalated with the conflict. Damaging civilian services gives Iran a way to impose visible costs without matching U.S. military power. That interpretation helps explain the strategic incentive, but it cannot establish the motive behind every unattributed incident ([Federal Bureau of Investigation et al., 2026][S02]; [Shah, 2026][S13]).

These actors can use legitimate engineering software to access controllers, extract project files, and alter logic or displayed readings. The July advisory names Rockwell Automation, Schneider Electric, and Siemens equipment, and describes disabled shutdown and alarm logic. An attacker with this access can interfere with a process without sophisticated malware. The reported behaviors map to ICS T0883, Internet Accessible Device, and T0885, Commonly Used Port, and Enterprise T1041, Exfiltration Over C2 Channel, and T1565, Data Manipulation ([Federal Bureau of Investigation et al., 2026][S02]).

Their opportunity depends on whether programming interfaces are reachable and adequately protected. At a water utility, access to a pump or treatment controller can turn a remote intrusion into a service problem. The connection to control functions is what makes this exposure serious. Independent process safeguards may still prevent an intrusion from causing a dangerous outcome.

CyberAv3ngers, also called Shahid Kaveh Group, is the historical comparator affiliated with the Islamic Revolutionary Guard Corps. The advisory distinguishes it from the broader 2026 actors; neither Minnesota nor Clayton County identifies it. Confidence is high in the mechanism and moderate in future relevance. Individual attribution remains unresolved. The August Siemens advisory and September Canadian warning describe wider, unattributed PLC activity and lower technical barriers, without establishing additional Iranian operations ([Canadian Centre for Cyber Security, 2026][S41]; [National Security Agency et al., 2026][S40]).

### Void Manticore and the Handala persona

Void Manticore is assessed as affiliated with Iran's Ministry of Intelligence and Security. Handala, Karma, and Homeland Justice are associated personas, so their names should not automatically be counted as separate organizations. The Justice Department's March domain seizures support the state connection, although the attack claims quoted in that release still need independent verification. Destruction and publicity offer ways to coerce and intimidate during the conflict ([MITRE, 2026][S17]; [U.S. Attorney's Office, District of Maryland, 2026][S03]).

Check Point reports compromised VPN access, provider targeting, stolen domain credentials, RDP movement, and destructive activity. These map to Enterprise T1133, T1199, T1078.002, T1021.001, and T1485. A utility could be exposed where provider accounts reach engineering, identity, or recovery systems. Provider targeting is documented, although a resulting Handala intrusion at a U.S. water utility is not established ([Check Point Research, 2026a][S06]). NIST's discussion of third-party remote maintenance confirms why this access matters to utilities ([Tang et al., 2026][S37]).

Stryker's March disruption offers an example of business consequences outside the water sector. Investigators later identified a malicious command file, following early statements that reported no indication of malware. Separation between systems protected several customer-facing products, but ordering, manufacturing, and shipping were disrupted. This shows why utilities should examine provider dependencies even where a provider's failure would not spread directly into process controls ([Stryker, 2026][S04]).

### Hacktivist collectives

Keymous+ and DieNet offer regional examples of politically motivated DDoS claims. Their reported targets are public online services. Radware treats those claims as evidence of intent, rather than verified impact, and its sample names no U.S. water victim. The material also does not establish an ability to control industrial processes or common state direction. A utility website could attract an attacker seeking publicity, but the evidence is too limited to rate a successful local outage ([Radware, 2026][S22]).

## Impact and risk assessment

Minnesota reported coordinated targeting of more than thirty community water systems on July 26–27. Its follow-up distinguished confirmed malicious activity from service disruption and retained uncertain attribution ([Minnesota IT Services, 2026a][S39]; [Minnesota IT Services, 2026b][S10]). Clayton County reported reduced pressure and a precautionary boil-water advisory. Service returned within hours, testing allowed the advisory to be lifted, and cyber contribution remained under investigation ([Thomas, 2026][S35]). CISA described controller lockouts and address changes associated with boil-water notices and sustained manual operation, without naming an actor ([Cybersecurity and Infrastructure Security Agency, 2026][S38]). Twelve-state reporting adds context rather than a consistent count of verified successful attacks ([Greig, 2026][S11]).

### Scenario scoring

Two scenarios are rated over twelve months. Likelihood is 1, unlikely, when the outcome is not expected; 2, plausible, when a credible route has uncertain prerequisites or success; or 3, likely, when recurrence is expected among exposed operators. Impact is 1 for limited, recoverable effects, 2 for substantial service or financial disruption, and 3 for critical-service interruption or credible serious safety consequences. Multiplication gives low priority at 1–2, medium at 3–4, and high at 6–9. These rankings do not calculate expected loss. Appendix C records conditions and review rules.

<div class="report-table" role="region" aria-label="Scenario ratings" tabindex="0">

| Scenario | Likelihood | Impact | Priority |
| --- | --- | --- | --- |
| SC1 · Controller interference | 2 · Plausible | 3 · Critical | **6 · High** |
| SC2 · Essential enterprise support destruction | 2 · Plausible | 2 · Substantial | **4 · Medium** |
| SC3 · Portal DDoS contingency | Unrated | Unrated | Unscored |

</div>

SC1, controller interference, is L2 × I3 = 6, high, with moderate confidence. Attempts are likely, but disruption requires exploitable access. Altered logic or readings could interrupt pumping or treatment. Untreated wastewater discharge is a possible consequence, not an observed outcome in the cited incidents. Stolen projects could expose confidential information. Recovery may require engineering work, extra staff, public-health precautions, and efforts to restore trust. Serious safety effects depend on failed or impaired independent safeguards. Exposed control interfaces support plausible success; their connection to essential processes supports critical impact.

SC2 covers destructive access to systems that support essential operations. It is rated L2 × I2 = 4, medium, with low confidence in its incidence in the water sector. The provider and credential pathway is credible, but an attacker would need privileges reaching the utility's support systems. Losing engineering workstations, records, or identity services could delay recovery, expose information, and create financial and reputational costs. Billing disruption alone would not establish a treatment outage. Impact should rise to 3 only where verified dependencies show that the loss could impair critical operations or safe recovery.

SC3, a DDoS outage of a public portal, remains unscored because targeting and provider-protection evidence is insufficient. An outage could delay notices or payments and increase calls, without establishing theft or altered information. Web and communications teams should check hostile traffic, provider capacity, past outages, and alternative notification reach. Consequences would increase if the portal were the only effective safety-warning channel. Uncertain local incidence warrants collection and continuity exercises.

Camera reconnaissance and interruption of Gulf-based services remain on the watchlist. Regional attempts against cameras show a possible attack method; AWS disclosures and Cloudflare measurements confirm regional service disruption. The reviewed evidence does not establish either exposure at a named U.S. water utility. A local asset or supplier review must therefore precede a rating ([Amazon Staff, n.d.][S26]; [Belson, 2026][S25]; [Check Point Research, 2026b][S05]). The overall high planning priority comes from SC1 at exposed operators. The risk remaining after controls cannot be assessed until those controls and recovery arrangements are verified.

## Analytic judgments and confidence

**J1**: Further attempts against exposed controllers are likely over the forecast period, with moderate confidence. Earlier attacks and the assessed escalation during the conflict support this judgment. It assumes that susceptible equipment remains reachable. Verified reductions in exposure would weaken that assumption.

**J2**: Local service disruption is plausible where engineering access is exposed and independent safeguards are inadequate, with moderate confidence. Federal findings describe how interference could occur, while local disclosures show that outcomes vary. The evidence does not establish a coordinated nationwide water shutdown. Confidence for an individual utility remains lower until its safeguards and recovery capacity are known.

**J3**: A temporary military pause is unlikely, by itself, to end existing access or the incentive to use it, with moderate confidence. Attackers may retain access, and strategic analysis describes cyber operations as a continuing means of pressure. A durable reduction in hostilities, accompanied by a sustained decline in independently observed activity, would support a lower forecast ([Shah, 2026][S13]).

### Competing explanations and reassessment indicators

For the July incidents, H1 is Iranian retaliation and H2 is exploitation by another actor. Federal attribution supports H1 for the documented campaign, without identifying every July attacker. Minnesota's timing fits either explanation; shared forensic artifacts would help distinguish them. Clayton County's unresolved causation allows an equipment contribution, testable against validated logs. The protections remain justified under either actor explanation.

Future targeting could also reflect wider opportunistic exploitation rather than sustained wartime escalation. The unattributed August PLC advisory supports this alternative, though it does not explain the attributed Iranian campaign. CSIS identifies capability constraints alongside incentives, so intent cannot establish future tempo ([National Security Agency et al., 2026][S40]; [Shah, 2026][S13]).

Confidence in further attempts is moderate, while the war's additional contribution is less certain. Durable de-escalation, reduced exposure, and fewer independently observed Iran-linked attacks would lower J1. Continued generic PLC attacks alone would not demonstrate continued Iranian escalation.

## Recommendations

### Operational actions

#### Priority 1 · Close unnecessary controller access

Priority 1 is to close the controller access described in SC1. OT managers and integrators should respond immediately to active compromise or unauthorized logic changes, preserve evidence, and validate projects and alarms. Within seven days, they should inventory exposed interfaces, including undocumented cellular modems and vendor maintenance connections. Unnecessary access should be closed safely. Where that cannot be completed at once, record an engineering-approved interim restriction and completion date. Verify external reachability and normal process behavior. The seven-day checkpoint is not a reason to delay response to an active incident ([CISA, 2026][S38]; [Federal Bureau of Investigation et al., 2026][S02]).

#### Priority 2 · Limit privileged and provider access

Priority 2 is to limit privileged and provider access for SC1 and SC2. Within fourteen days, IT and provider leads should identify remote accounts, remove unnecessary permissions, and separate OT and IT administration. Require multifactor authentication on gateways and services that support it. Legacy equipment needs a protected access route approved by engineers. Compare VPN and RDP sessions with work orders and investigate suspicious access immediately. Every essential remote account should have an owner, an approved scope, and logs that can be reviewed ([Tang et al., 2026][S37]; [EPA, 2024][S36]).

#### Priority 3 · Test safe operation, recovery, and communication

Priority 3 is to test how the utility would operate, recover, and communicate during disruption. Within thirty days, operations, continuity, and communications leads should run a safe tabletop exercise and a representative restoration test. Check trusted backups, staffing, and alternative public notices. Recovery targets should reflect process tolerances, storage or reserve capacity, and public-health requirements. A tabletop can reveal weaknesses, but it cannot demonstrate technical restoration. Record the results of actual tests and any constraints still unresolved.

### Strategic decisions and reassessment

Executives should fund integrator time and recovery exercises, assign responsible owners, and review progress after thirty days. Smaller utilities should seek shared support through state or sector partners. NIST offers examples of protected remote access that can be adapted without losing essential maintenance ([Tang et al., 2026][S37]). Supplier agreements should require named accounts, incident notification, and separation between customer environments. Any unresolved critical exposure needs a dated mitigation plan and explicit executive acceptance.

Review the assessment monthly and after incidents. Campaign-linked artifacts would increase SC1's urgency, while provider access to essential operations could raise SC2's impact. Relevant portal threats or confirmed protection gaps would justify scoring SC3. Camera exposure or Gulf dependencies would bring the watchlist into the local assessment. Tested controls and a sustained decline in independently observed Iran-linked activity would support lower ratings. Each change should record its evidence and assumptions; a military pause alone is insufficient.

## Appendix A. Graded source log

Sources were reviewed on October 9, 2026. The identifiers connect claims across the appendices, and the linked publisher cells open each publication. Full titles appear in the reference list. Publication dates are distinguished from incident dates. Guidance informs the recommended controls without establishing which controls a named victim had in place.

R1 strong access to the observation; R2 established but partial visibility; R3 uncertain provenance. E1 independently corroborated observation; E2 direct disclosure with limited corroboration; E3 inference or assessed attribution; E4 unverified claim; E5 contradicted; E6 insufficient information. No E1 grade is assigned solely because several publications repeat one disclosure.

<div class="report-table" role="region" aria-label="Graded source log" tabindex="0">

| ID and publisher | Source type and date | Claim grade | Use and limitations |
| --- | --- | --- | --- |
| **S02** [FBI et al.][S02] | Government advisory July 22, 2026 revision | R1 / E2 observations; E3 attribution | PLC interference and assessed escalation. Federal victim engagements; not proof of attribution at every July utility. |
| **S03** [U.S. Attorney's Office District of Maryland][S03] | Government/legal March 19, 2026 | R1 / E2 seizures; E3 state link; E4 quoted claims | Domain seizures and investigative linkage. Allegations and persona claims remain distinct from demonstrated impact. |
| **S04** [Stryker][S04] | Operator disclosure March 11-April 1, 2026 | R1 / E2 disruption and investigation | Enterprise disruption outside water. Separation protected several customer products; ordering and shipping were disrupted. Do not equate no direct spread with no downstream impact. |
| **S05** [Check Point Research 2026b][S05] | Vendor telemetry March 4, 2026 | R2 / E2 attempts; E3 actor / purpose | Regional camera-targeting attempts. Vendor visibility is partial; no demonstrated U.S. water replication. Watchlist only. |
| **S06** [Check Point Research 2026a][S06] | Vendor research March 12, 2026 | R2 / E2 behavior; E3 actor link | Handala tradecraft and provider targeting. Actor-level research, not all Stryker-specific or a U.S. water intrusion. |
| **S10** [Minnesota IT Services 2026b][S10] | Government incident notice July 28, 2026; events July 26-27 | R1 / E2 targeting | More than 30 community systems targeted. Direct responder notice; no actor attribution or complete victim outcomes. |
| **S11** [Greig The Record][S11] | Journalism August 5, 2026 | R2 / E2 reported effects; E3 Iran link | Twelve-state reporting snapshot. Repeats some primary notices and other reporting; not independent confirmation of all incidents. |
| **S13** [Shah CSIS][S13] | Think-tank analysis August 6, 2026 | R2 / E3 interpretation | Asymmetric wartime role and constraints. Strategic analysis overlaps incident reporting; not independent forensic attribution. |
| **S15** [Associated Press][S15] | Journalism October 8, 2026 | R2 / E2 announcement | Complete ClickOnDetroit syndication reviewed. Reported strike pause; no observation of eliminated cyber access. |
| **S17** [MITRE ATT&CK][S17] | Technical reference Group modified July 31, 2026 | R1 / E2 IDs; R2 / E3 derived actor account | G1055 and linked definitions reviewed. Actor catalogue derives from vendors and government; not independent corroboration. |
| **S21** [FIRST][S21] | Technical standard TLP 2.0, 2022 | R1 / E2 definitions | Handling standard. Supports public sharing designation, not accuracy or attribution. |
| **S22** [Radware][S22] | Vendor/OSINT research March 3, 2026 | R2 / E2 collection; E4 success; E3 intent | Opening-war claim sample. Availability checks do not establish success; no continuous campaign rate or named U.S. water victim. |
| **S25** [Belson Cloudflare][S25] | Vendor measurement April 28, 2026; Q1 observations | R2 / E2 measurements; E3 causes | Regional connection failures, alongside secondary damage reporting. Independent telemetry on availability; no U.S. water dependency. |
| **S26** [Amazon Staff][S26] | Operator disclosure No displayed date | R1 / E2 regional disruption | Bahrain service disruption and migration advice. Provider observation; no inference of intrusion or local utility exposure. |
| **S35** [Thomas / CCWA][S35] | Operator disclosure August 3, 2026; event July 27 | R1 / E2 effects; E3 cyber contribution | Official utility notice posted by Erin Thomas. Effects confirmed; cyber contribution under investigation. Does not establish actor, contamination, or technical cause. |
| **S36** [U.S. EPA][S36] | Government guidance August 2024 revision | R1 / E2 recommended practices | Water-specific controls and assessment checklist. Normative guidance, not proof that any victim lacked a control. |
| **S37** [Tang et al. NIST][S37] | Technical guidance June 2026 final | R1 / E2 architectures | Water-sector remote-access architecture and MFA considerations. Demonstration guidance; tailor locally. Official PDF confirms June 2026 final status and DOI. |
| **S38** [CISA][S38] | Government alert July 30, 2026 | R1 / E2 reported effects | Controller lockouts, address changes, and sector consequences. No actor attribution; not a count of independently confirmed victims. |
| **S39** [Minnesota IT Services 2026a][S39] | Government follow-up July 30, 2026 | R1 / E2 observations | Clarifies malicious activity versus service loss and unresolved attribution. Same response as S10, not an independent incident set. |
| **S40** [NSA et al.][S40] | Government advisory August 19, 2026 | R1 / E2 behavior; E3 intent | Active Siemens PLC reconnaissance and capability development affecting U.S. sectors including water. No Iranian attribution in this advisory. |
| **S41** [Canadian Centre for Cyber Security][S41] | Government assessment September 14, 2026 | R1 / E2 own observations; E3 forecast | Global PLC threat and third-party exposure. U.S. discussion repeats partner reporting; Canadian observations do not establish a U.S. incident. |
| **S42** [MITRE ATT&CK][S42] | Technical reference Version 19; accessed October 9, 2026 | R1 / E2 definitions | Technique definitions for Appendix B. Framework taxonomy, not independent evidence of a particular intrusion. |

</div>

### Evidence convergence and remaining gaps

S02 supports the assessed Iranian-affiliated campaign. S10/S39 and S35 describe separate local incidents, while S38 reports sector effects without identifying an actor. S40 adds evidence of wider, unattributed PLC targeting. S41 partly draws on U.S. advisories, so its account of those incidents is not counted as another independent observation. S11 repeats notices, S13 interprets reporting, and S17 summarizes research. Together, these sources establish the sector's relevance while leaving individual attribution unresolved.

For the watchlist, S25 provides independent measurements of connection failures and S26 provides a service operator's disclosure. Both support regional disruption, but neither establishes a U.S. utility's dependency on the affected services. Public disclosures dominate the collection. Unreported incidents and unmeasured safeguards therefore remain material gaps.

## Appendix B. Adversary technique mappings

The table maps behaviors reported in S02 and S06 using MITRE ATT&CK version 19 definitions ([MITRE, n.d.][S42]). It does not establish that every water victim experienced those behaviors. ICS and Enterprise techniques are identified separately. Teams should interpret detection suggestions alongside local telemetry and approved maintenance. T1485 covers file and data destruction; wiping disk structures would need a separate mapping.

<div class="report-table" role="region" aria-label="Adversary technique mappings" tabindex="0">

| Actor | Matrix and technique | Evidence | Detection or control |
| --- | --- | --- | --- |
| 2026 OT actor set | ICS T0883 · Internet Accessible Device | S02: exposed controller access. | Compare approved asset inventory and firewall records with reachable control interfaces; validate closure safely. |
| 2026 OT actor set | ICS T0885 · Commonly Used Port | S02: OT protocol traffic. | Review flows to controller ports against permitted engineering sources and maintenance windows. |
| 2026 OT actor set | Enterprise T1041 · Exfiltration Over C2 Channel | S02: project extraction. | Investigate unexpected project uploads or downloads and unfamiliar engineering endpoints, using available controller and gateway logs. |
| 2026 OT actor set | Enterprise T1565 · Data Manipulation | S02: logic/display changes. | Compare project versions and alarm configuration with trusted baselines; independently validate process readings. |
| Void Manticore | Enterprise T1133 · External Remote Services | S06: VPN entry. | Correlate remote sessions with named users, work orders, endpoint identity, and normal access times. |
| Void Manticore | Enterprise T1199 · Trusted Relationship | S06: provider targeting. | Review provider privileges and cross-client accounts; require notification of a compromised service relationship. |
| Void Manticore | Enterprise T1078.002 · Domain Accounts | S06: stolen credentials. | Investigate unfamiliar privileged logons or new grants inconsistent with approved administration. |
| Void Manticore | Enterprise T1021.001 · Remote Desktop Protocol | S06: internal movement. | Compare RDP source/destination pairs with authorized administration; investigate new routes to essential hosts. |
| Void Manticore | Enterprise T1485 · Data Destruction | S06: deletion and wiping. | Alert on destructive administration where supported; correlate account, host, and deletion events. Protect recovery access. |
| Hacktivist claims | No precise mapping | S22: mechanism or success insufficient. | Require provider traffic evidence and a verified service effect before assigning a DoS sub-technique. |

</div>

**Indicator handling**: Search historical logs against dated advisory indicators and their association windows. Check infrastructure before blocking it, since shared hosting alone cannot establish attribution. Use the incident plan to escalate verified project changes or destructive access.

## Appendix C. Full risk register and watchlist

**Forecast**: October 9, 2026 to October 9, 2027. Ratings concern successful outcomes under stated conditions. Local controls are unknown. SC1 drives the high priority for exposed operators, rather than a measured national risk after controls.

L1 unlikely: outcome not expected; L2 plausible: credible pathway with uncertain prerequisites or success; L3 likely: recurrence expected. I1 limited and recoverable; I2 substantial service or financial disruption; I3 critical-service interruption or credible serious safety consequences. Scores: 1-2 low, 3-4 medium, 6-9 high. Rankings are ordinal.

<div class="report-table" role="region" aria-label="Risk register summary" tabindex="0">

| ID | Scenario and condition | L | I | Priority |
| --- | --- | --- | --- | --- |
| SC1 | Controller interference through exploitable engineering access | 2 | 3 | **6 · High** |
| SC2 | Essential support destruction through privileged or provider access | 2 | 2 | **4 · Medium** |
| SC3 | Portal DDoS pending local threat and protection evidence | — | — | Unscored |

</div>

### SC1 · Controller interference

**Assets and exposure**: PLCs, HMI/SCADA, remote modems, and pump or treatment controls. The scenario assumes an engineering interface that permits unauthorized changes and inadequate independent protection for the affected process.

**Actor and evidence**: Iranian-affiliated OT actors. S02 supports the mechanism and assessed escalation. S10/S39, S35, and S38 describe sector events without establishing common attribution. S40/S41 add wider PLC threat evidence, which cannot automatically be assigned to Iran.

**Consequences**: Stolen projects affect confidentiality; altered logic or readings affect integrity; interrupted control affects availability. Operations may require equipment validation and safe fallback. Pressure or treatment failures and untreated wastewater discharge depend on impaired safeguards. Engineering recovery, staffing, and service loss create costs, with possible damage to public confidence.

**Rating and confidence**: L2 × I3 = 6, high. Exposed programming supports plausible interference, while essential processes make serious consequences credible. The score concerns successful interference; attempts are assessed as likely. Confidence is moderate in this pathway and lower at individual utilities until exposure and safeguards are checked.

**Controls and accountable owner**: Existing controls are unknown. The OT manager and integrator should find undocumented cellular and vendor connections, check protected access, and validate project files, alarms, and independent process checks. The executive sponsor funds the work and accepts any unresolved exposure.

**Completion and recovery evidence**: Within seven days, complete the inventory and close unnecessary access or document interim restrictions. Active compromise requires immediate response. Set safe operating and restoration tolerances using the affected process, reserve capacity, staffing, and public-health requirements. Record successful controller restoration and validated process behavior.

**Warnings and residual risk**: Investigate unexpected project changes, disabled alarms, or campaign-linked connections immediately. Verified access closure lowers likelihood; tested independent safeguards and recovery may lower impact. The risk after controls remains unassessed until those controls are demonstrated. Review monthly and after incidents.

### SC2 · Essential enterprise support destruction

**Assets and exposure**: Identity systems, engineering workstations, essential records, and provider administration. The scenario assumes that a compromised account can damage services needed for operation or recovery.

**Actor and evidence**: Void Manticore/Handala or another destructive actor. S03/S06 support the state connection and use of provider access and credentials. S04 illustrates consequences outside water; it is not an incident involving a water provider.

**Consequences**: Records could be stolen, if theft is demonstrated, or damaged and made unavailable. Loss of support systems could delay engineering work and restoration. Safety consequences depend on whether essential processes rely on those systems. Recovery costs and delayed revenue could affect finances, while unreliable records and service could damage trust.

**Rating and confidence**: L2 × I2 = 4, medium. The access route is credible, but reviewed sources do not establish a Handala intrusion at a named U.S. water utility. Confidence in local incidence is low. Raise impact to 3 only if verified dependencies show that service loss could impair critical operation or safe recovery. Billing disruption alone does not justify that increase.

**Controls and accountable owner**: Existing controls are unknown. IT, identity, and provider leads should restrict privileges, separate OT/IT and restoration credentials, require MFA where remote services support it, and review sessions and backups. Legacy devices need an approved protected gateway. Executives approve supplier changes and accept unresolved exposure.

**Completion and recovery evidence**: Within fourteen days, give every essential remote account an owner, approved scope, and reviewable logs. Investigate suspicious access immediately. Within thirty days, test restoration of representative essential services. Set recovery targets from process tolerances and dependencies rather than a universal 24-hour target.

**Warnings and residual risk**: Provider compromise, destructive privileges, or failed restoration tests increase urgency. Access to essential process support could raise impact. Tested separation limits an attacker's reach, and verified recovery limits outage consequences. The risk after controls remains unassessed pending evidence. Review monthly and after provider alerts.

### SC3 · Portal DDoS contingency

**Assets and exposure**: The public website, payment portal, and online notices. The outcome considered is a successful outage. Before scoring it, verify local targeting, provider protections, and whether alternative notices reach the public. Attack claims alone are insufficient.

**Actor and evidence**: Hacktivist collectives. S22 records regional claims and political interest, but names no U.S. water victim and does not establish an ability to control industrial processes.

**Consequences**: Temporary portal loss would affect availability. A separate finding is needed to establish theft or altered information. Calls could increase and public notices or payments could be delayed. Safety effects should remain limited where alternative notices work. Response costs, delayed payments, and misleading attack claims could affect finances and public trust.

**Rating and confidence**: Unscored, with low confidence in local incidence. S22 names no U.S. water victim or measured utility outage. Collect relevant hostile traffic, provider capacity and protection details, past outage evidence, and notification dependencies before rating likelihood and impact. Consequences could be more serious if the portal were the only effective channel for safety notices.

**Controls and accountable owner**: Existing controls are unknown. The web/IT lead should confirm provider protection and escalation arrangements. Communications staff should test alternative channels and agree a process for checking attack claims with public-health partners.

**Completion and recovery evidence**: Within thirty days, exercise public notification during portal loss and escalation to the provider. Set notification targets from local public-health protocols and channel reach. Record response times and test delivery, since a written plan cannot demonstrate readiness.

**Warnings and reassessment**: Score the scenario locally if provider-confirmed hostile traffic, relevant sector incidents, protection gaps, or verified service loss provide enough evidence. Unsupported claims alone do not justify scoring. Tested notices and provider defenses inform both ratings. The communications director owns the public response and reviews arrangements after outages or relevant threats.

### Unscored watchlist and collection requirements

**W1 Camera or management reconnaissance.** S05 reports regional attempts against cameras and assessed Iranian links. The reviewed evidence does not establish the same activity at a U.S. water utility. Site security and OT teams should identify exposed equipment and check access records first. Verified exposure would support a local rating; successful access or movement into other systems would increase urgency. Facility images could affect confidentiality and reputation. Operational or safety effects would require additional access.

**W2 Gulf service or supplier interruption.** S25 measures regional connection failures, and S26 discloses disruption of AWS services in Bahrain. A U.S. utility's dependence on that region has not been established. Procurement should identify where essential suppliers host identity, support, and recovery services. A material dependency without effective alternatives would justify assessing local availability risk. Regional disruption alone is insufficient. Physical damage can interrupt a provider without a cyber intrusion, so any information theft or alteration needs separate evidence.

**Collection priority**: Verify controller exposure and safeguards for SC1 first, then privileged provider access and recovery dependencies for SC2. Seek authoritative attribution and equipment findings before changing an incident explanation. Collect watchlist evidence where an asset or supplier inventory shows relevance. Neither watchlist item contributes to the overall high rating.

## References

- **S26.** Amazon Staff. (n.d.). AWS Bahrain Region disrupted by ongoing conflict. About Amazon. Retrieved October 9, 2026. [View source S26][S26]
- **S15.** Associated Press. (2026, October 8). Trump says US will not resume military strikes on Iran before the Nov. 3 midterm elections. ClickOnDetroit. [View source S15][S15]
- **S25.** Belson, D. (2026, April 28). Shutdowns, power outages, and conflict: A review of Q1 2026 Internet disruptions. Cloudflare. [View source S25][S25]
- **S41.** Canadian Centre for Cyber Security. (2026, September 14). Cyber threat actors use artificial intelligence in an active global campaign to disrupt internet-exposed programmable logic controllers. [View source S41][S41]
- **S06.** Check Point Research. (2026a, March 12). "Handala Hack" - Unveiling group's modus operandi. [View source S06][S06]
- **S05.** Check Point Research. (2026b, March 4). Interplay between Iranian targeting of IP cameras and physical warfare in the Middle East. [View source S05][S05]
- **S38.** Cybersecurity and Infrastructure Security Agency. (2026, July 30). CISA urges water and wastewater systems sector to protect OT against activity targeting PLCs. [View source S38][S38]
- **S02.** Federal Bureau of Investigation, Cybersecurity and Infrastructure Security Agency, National Security Agency, Environmental Protection Agency, Department of Energy, United States Cyber Command Cyber National Mission Force, & Department of the Treasury. (2026, July 22). Iranian-affiliated cyber actors exploit programmable logic controllers across US critical infrastructure (Joint Cybersecurity Advisory AA26-097A; original publication April 7, 2026). [View source S02][S02]
- **S21.** FIRST. (2022). Traffic Light Protocol (TLP) definitions and usage (Version 2.0). [View source S21][S21]
- **S11.** Greig, J. (2026, August 5). Cyberattacks on water systems expand to 12 states as South Dakota, Georgia announce incidents. The Record. [View source S11][S11]
- **S39.** Minnesota IT Services. (2026a, July 30). Minnesota continues response to cyber activity affecting community water systems. [View source S39][S39]
- **S10.** Minnesota IT Services. (2026b, July 28). MNIT activates statewide cybersecurity response to support affected communities and protect critical infrastructure. [View source S10][S10]
- **S42.** MITRE. (n.d.). MITRE ATT&CK (Version 19). Retrieved October 9, 2026. [View source S42][S42]
- **S17.** MITRE. (2026, July 31). VOID MANTICORE (G1055). MITRE ATT&CK. Retrieved October 9, 2026. [View source S17][S17]
- **S40.** National Security Agency, Cybersecurity and Infrastructure Security Agency, Federal Bureau of Investigation, Department of Energy, & Environmental Protection Agency. (2026, August 19). Defending against an active threat to Siemens S7 series PLCs (Joint Cybersecurity Advisory AA26-231A). [View source S40][S40]
- **S22.** Radware. (2026, March 3). Retaliatory hacktivist DDoS activity following Operation Epic Fury/Roaring Lion. [View source S22][S22]
- **S13.** Shah, N. (2026, August 6). How Tehran's use of cyber operations in the U.S.-Iran conflict has evolved. Center for Strategic and International Studies. [View source S13][S13]
- **S04.** Stryker. (2026, April 1). Customer updates: Stryker network disruption. [View source S04][S04]
- **S37.** Tang, C., Marron, J., Fenimore, P., Saravia, S., Stea, B., White, C., & Wiltberger, J. (2026, June). Cybersecurity for the water and wastewater sector: Build architecture: Operational technology remote access (NIST Special Publication 1800-45). National Institute of Standards and Technology. [View source S37][S37]
- **S35.** Thomas, E. (2026, August 3). Clayton County Water Authority security advisory: Cyber threat awareness & response. Clayton County Water Authority. [View source S35][S35]
- **S03.** U.S. Attorney's Office, District of Maryland. (2026, March 19). Justice Department disrupts Iranian cyber enabled psychological operations. U.S. Department of Justice. [View source S03][S03]
- **S36.** U.S. Environmental Protection Agency. (2024, August). EPA guidance on improving cybersecurity at drinking water and wastewater systems. [View source S36][S36]

[S26]: https://www.aboutamazon.com/news/aws-bahrain-region-middle-east-conflict
[S15]: https://www.clickondetroit.com/news/world/2026/10/08/trump-says-us-will-not-resume-military-strikes-on-iran-before-the-nov-3-midterm-elections/
[S25]: https://blog.cloudflare.com/q1-2026-internet-disruption-summary/
[S41]: https://www.cyber.gc.ca/en/news-events/cyber-threat-actors-use-artificial-intelligence-active-global-campaign-disrupt-internet-exposed-programmable-logic-controllers
[S06]: https://research.checkpoint.com/2026/handala-hack-unveiling-groups-modus-operandi/
[S05]: https://research.checkpoint.com/2026/interplay-between-iranian-targeting-of-ip-cameras-and-physical-warfare-in-the-middle-east/
[S38]: https://content.govdelivery.com/accounts/USDHSCISA/bulletins/422e63c
[S02]: https://www.ic3.gov/CSA/2026/260722.pdf
[S21]: https://www.first.org/tlp/
[S11]: https://therecord.media/iran-cyberattacks-water-treatment
[S39]: https://mn.gov/mnit/media/blog/?id=38-762209
[S10]: https://mn.gov/mnit/media/blog/?id=38-761869
[S42]: https://attack.mitre.org/versions/v19/
[S17]: https://attack.mitre.org/groups/G1055/
[S40]: https://www.ic3.gov/CSA/2026/260819.pdf
[S22]: https://www.radware.com/security/threat-advisories-and-attack-reports/ddos-activity-following-operation-epic-fury-roaring-lion/
[S13]: https://www.csis.org/analysis/how-tehrans-use-cyber-operations-us-iran-conflict-has-evolved
[S04]: https://www.stryker.com/us/en/about/news/2026/a-message-to-our-customers-03-2026.html
[S37]: https://csrc.nist.gov/pubs/sp/1800/45/final
[S35]: https://www.ccwa.us/Blog.aspx?IID=35
[S03]: https://www.justice.gov/usao-md/pr/justice-department-disrupts-iranian-cyber-enabled-psychological-operations
[S36]: https://www.epa.gov/system/files/documents/2024-08/epa-guidance-on-improving-cybersecurity-at-drinking-water-and-wastewater-systems-1.pdf
