export default function CommissionCalculatorApp() {
  const React = window.React;
  const { useState, useMemo } = React;

  const initialRows = [
    { id: 1, student: "", weeks: 25, days: "Monday-Thursday" },
  ];

  const [rows, setRows] = useState(initialRows);

  const getTuitionFee = (weeks, days) => {
    if (weeks < 14) {
      return days === "Monday-Friday" ? 360 : 320;
    }
    if (weeks < 25) {
      return days === "Monday-Friday" ? 330 : 300;
    }
    return days === "Monday-Friday" ? 300 : 280;
  };

  const getCommissionRate = (index) => {
    if (index <= 4) return 0.3;
    if (index === 5) return 0.31;
    if (index === 6) return 0.32;
    if (index === 7) return 0.33;
    if (index === 8) return 0.34;
    return 0.35;
  };

  const calculatedRows = useMemo(() => {
    let previousCommissionTotal = 0;

    return rows.map((row, index) => {
      const tuitionPerWeek = getTuitionFee(row.weeks || 0, row.days);
      const totalFee = (row.weeks || 0) * tuitionPerWeek;
      const commissionRate = getCommissionRate(index);

      let bonusRate = 0;
      if (index === 5) bonusRate = 0.01;
      if (index === 6) bonusRate = 0.02;
      if (index === 7) bonusRate = 0.03;
      if (index === 8) bonusRate = 0.04;
      if (index >= 9) bonusRate = 0.05;

      const commission = totalFee * commissionRate + previousCommissionTotal * bonusRate;
      previousCommissionTotal += commission;

      return {
        ...row,
        tuitionPerWeek,
        totalFee,
        commissionRate,
        commission,
      };
    });
  }, [rows]);

  const totalRevenue = calculatedRows.reduce((sum, r) => sum + r.totalFee, 0);
  const totalCommission = calculatedRows.reduce((sum, r) => sum + r.commission, 0);

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        student: "",
        weeks: 0,
        days: "Monday-Thursday",
      },
    ]);
  };

  const removeRow = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800">
                Commission Calculator
              </h1>
              <p className="text-slate-500 mt-2">
                Tuition Centre Enrollment & Commission Management Tool
              </p>
            </div>

            <button
              onClick={addRow}
              className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-medium hover:opacity-90 transition"
            >
              + Add Student
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200">
            <p className="text-slate-500 text-sm">Total Students</p>
            <h2 className="text-4xl font-bold mt-2">{calculatedRows.length}</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200">
            <p className="text-slate-500 text-sm">Total Revenue</p>
            <h2 className="text-4xl font-bold mt-2">
              ${totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200">
            <p className="text-slate-500 text-sm">Total Commission</p>
            <h2 className="text-4xl font-bold mt-2 text-emerald-600">
              ${totalCommission.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">Student Name</th>
                  <th className="p-4 text-left">Weeks</th>
                  <th className="p-4 text-left">Schedule</th>
                  <th className="p-4 text-left">Fee / Week</th>
                  <th className="p-4 text-left">Total Fee</th>
                  <th className="p-4 text-left">Commission Rate</th>
                  <th className="p-4 text-left">Commission</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {calculatedRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">{index + 1}</td>

                    <td className="p-4">
                      <input
                        value={row.student}
                        onChange={(e) =>
                          updateRow(row.id, "student", e.target.value)
                        }
                        placeholder="Student Name"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </td>

                    <td className="p-4">
                      <input
                        type="number"
                        value={row.weeks}
                        onChange={(e) =>
                          updateRow(row.id, "weeks", Number(e.target.value))
                        }
                        className="w-24 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </td>

                    <td className="p-4">
                      <select
                        value={row.days}
                        onChange={(e) =>
                          updateRow(row.id, "days", e.target.value)
                        }
                        className="border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      >
                        <option>Monday-Thursday</option>
                        <option>Monday-Friday</option>
                      </select>
                    </td>

                    <td className="p-4 font-medium text-slate-700">
                      ${row.tuitionPerWeek}
                    </td>

                    <td className="p-4 font-semibold">
                      ${row.totalFee.toLocaleString()}
                    </td>

                    <td className="p-4">
                      {(row.commissionRate * 100).toFixed(0)}%
                    </td>

                    <td className="p-4 font-bold text-emerald-600">
                      ${row.commission.toFixed(2)}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => removeRow(row.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Commission Logic
          </h3>

          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50">
              <p className="font-semibold text-slate-800 mb-2">Tuition Fees</p>
              <ul className="space-y-1">
                <li>&lt; 14 weeks → $360 (Mon-Fri) / $320 (Mon-Thu)</li>
                <li>14–24 weeks → $330 / $300</li>
                <li>25+ weeks → $300 / $280</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50">
              <p className="font-semibold text-slate-800 mb-2">Commission Scaling</p>
              <ul className="space-y-1">
                <li>Students 1–5 → 30%</li>
                <li>Student 6 → 31% + 1% bonus</li>
                <li>Student 7 → 32% + 2% bonus</li>
                <li>Student 8 → 33% + 3% bonus</li>
                <li>Student 9 → 34% + 4% bonus</li>
                <li>Student 10+ → 35% + 5% bonus</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
