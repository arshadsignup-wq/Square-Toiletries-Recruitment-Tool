import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { amountInWords, formatDate } from "@/lib/utils";

export type ProposalData = {
  referenceNo: string;
  candidateName: string;
  designation: string;
  department: string | null;
  age: number;
  nidNumber: string;
  address: string;
  salary: number;
  joiningDate: Date;
  issuedAt: Date;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 52,
    fontSize: 10.5,
    lineHeight: 1.5,
    color: "#0f172a",
    fontFamily: "Helvetica",
  },
  logo: { width: 132, marginBottom: 6 },
  companyLine: { fontSize: 8.5, color: "#64748b" },
  rule: { borderBottomWidth: 1.5, borderBottomColor: "#0057a8", marginTop: 10, marginBottom: 18 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  meta: { fontSize: 9.5, color: "#334155" },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 18,
    textDecoration: "underline",
  },
  paragraph: { marginBottom: 10, textAlign: "justify" },
  bold: { fontFamily: "Helvetica-Bold" },
  table: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginBottom: 16,
  },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  rowLast: { flexDirection: "row" },
  cellLabel: {
    width: "38%",
    padding: 7,
    backgroundColor: "#f1f5f9",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
  },
  cellValue: { width: "62%", padding: 7, fontSize: 10 },
  signatures: { flexDirection: "row", justifyContent: "space-between", marginTop: 26 },
  signBlock: { width: "42%" },
  signLine: { borderTopWidth: 1, borderTopColor: "#334155", paddingTop: 5 },
  signName: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  signRole: { fontSize: 9, color: "#64748b" },
  footer: {
    position: "absolute",
    bottom: 26,
    left: 52,
    right: 52,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 6,
  },
});

function Field({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={last ? styles.rowLast : styles.row}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

export function ProposalDocument({
  data,
  logo,
}: {
  data: ProposalData;
  logo?: Buffer;
}) {
  const salaryText = `BDT ${data.salary.toLocaleString("en-IN")}/- (${amountInWords(
    data.salary,
  )} Taka only) per month`;

  return (
    <Document
      title={`Appointment Proposal — ${data.candidateName}`}
      author="Square Toiletries Limited"
    >
      <Page size="A4" style={styles.page}>
        {logo ? (
          <Image style={styles.logo} src={{ data: logo, format: "png" }} />
        ) : (
          <Text style={[styles.bold, { fontSize: 14 }]}>
            SQUARE TOILETRIES LIMITED
          </Text>
        )}
        <Text style={styles.companyLine}>Human Resources Department</Text>
        <View style={styles.rule} />

        <View style={styles.metaRow}>
          <Text style={styles.meta}>Ref: {data.referenceNo}</Text>
          <Text style={styles.meta}>Date: {formatDate(data.issuedAt)}</Text>
        </View>

        <Text style={styles.title}>APPOINTMENT PROPOSAL</Text>

        <Text style={styles.paragraph}>
          Dear <Text style={styles.bold}>{data.candidateName}</Text>,
        </Text>

        <Text style={styles.paragraph}>
          With reference to your application and subsequent interview with us, we are
          pleased to propose your appointment at Square Toiletries Limited on the terms
          and conditions set out below.
        </Text>

        <View style={styles.table}>
          <Field label="Name of Candidate" value={data.candidateName} />
          <Field label="Designation" value={data.designation} />
          {data.department ? (
            <Field label="Department" value={data.department} />
          ) : null}
          <Field label="Age" value={`${data.age} years`} />
          <Field label="National ID (NID)" value={data.nidNumber || "Not provided"} />
          <Field label="Address" value={data.address} />
          <Field label="Monthly Gross Salary" value={salaryText} />
          <Field
            label="Date of Joining"
            value={formatDate(data.joiningDate)}
            last
          />
        </View>

        <Text style={styles.paragraph}>
          You are requested to report to the Human Resources Department on the date of
          joining mentioned above, along with your original academic certificates,
          National ID card, recent passport-size photographs and release documents from
          your previous employer, where applicable.
        </Text>

        <Text style={styles.paragraph}>
          This proposal is subject to verification of the information furnished in your
          application. Your employment will otherwise be governed by the service rules
          and policies of Square Toiletries Limited as amended from time to time.
        </Text>

        <Text style={styles.paragraph}>
          Please confirm your acceptance by signing and returning a copy of this
          proposal.
        </Text>

        <View style={styles.signatures} wrap={false}>
          <View style={styles.signBlock}>
            <View style={styles.signLine}>
              <Text style={styles.signName}>Authorised Signatory</Text>
              <Text style={styles.signRole}>Human Resources Department</Text>
              <Text style={styles.signRole}>Square Toiletries Limited</Text>
            </View>
          </View>
          <View style={styles.signBlock}>
            <View style={styles.signLine}>
              <Text style={styles.signName}>Accepted by Candidate</Text>
              <Text style={styles.signRole}>{data.candidateName}</Text>
              <Text style={styles.signRole}>Date: ______________________</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          Square Toiletries Limited — Human Resources · {data.referenceNo} · This is a
          computer-generated proposal.
        </Text>
      </Page>
    </Document>
  );
}
