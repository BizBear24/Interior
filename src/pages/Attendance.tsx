import { useStore } from '../store';
import { Avatar } from '../components/ui/Avatar';

export function Attendance() {
  const { employees } = useStore();

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const simulatedAttendance = employees.map((emp) => {
    const seed = emp.id.charCodeAt(1);
    const isPresent = seed % 5 !== 0;
    const isWFH = seed % 7 === 0;
    const checkIn = isPresent ? `0${8 + (seed % 2)}:${seed % 2 === 0 ? '30' : '00'}` : null;
    const checkOut = isPresent && seed % 3 !== 0 ? `${17 + (seed % 2)}:${seed % 2 === 0 ? '00' : '30'}` : null;
    return { emp, isPresent, isWFH, checkIn, checkOut, status: !isPresent ? 'absent' : isWFH ? 'WFH' : 'present' };
  });

  const present = simulatedAttendance.filter((a) => a.isPresent).length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500">{today} · {present}/{employees.length} present</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Employee</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Department</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Check In</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Check Out</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {simulatedAttendance.map(({ emp, checkIn, checkOut, status }) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={emp.name} size="xs" />
                    <div>
                      <p className="font-medium text-gray-900 text-xs">{emp.name}</p>
                      <p className="text-[10px] text-gray-400">{emp.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-600">{emp.department}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    status === 'present' ? 'bg-green-50 text-green-700' :
                    status === 'WFH' ? 'bg-blue-50 text-blue-700' :
                    'bg-red-50 text-red-700'
                  }`}>{status}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-600">{checkIn || '—'}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-600">{checkOut || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
