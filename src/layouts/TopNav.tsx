import { useState } from 'react';
import { Search, Bell, ChevronDown, Menu, X, Command } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { cn, formatDate } from '../utils';

interface TopNavProps {
  onMenuToggle: () => void;
  breadcrumb?: { label: string; path?: string }[];
}

export function TopNav({ onMenuToggle, breadcrumb }: TopNavProps) {
  const { users, currentUserId, setCurrentUser, notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { projects, clients, tasks } = useStore();

  const searchResults = searchQuery.length > 1 ? [
    ...projects.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => ({ type: 'Project', label: p.name, path: `/projects/${p.id}` })).slice(0, 3),
    ...clients.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((c) => ({ type: 'Client', label: c.name, path: `/crm` })).slice(0, 2),
    ...tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase())).map((t) => ({ type: 'Task', label: t.title, path: `/tasks` })).slice(0, 2),
  ] : [];

  return (
    <header className="h-14 flex items-center px-4 gap-4 z-30 shrink-0" style={{ background: '#FEFCF7', borderBottom: '1px solid var(--cream-dark)' }}>
      {/* Mobile menu toggle */}
      <button onClick={onMenuToggle} className="lg:hidden text-gray-500 hover:text-gray-700">
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="hidden lg:flex items-center gap-1 text-sm text-gray-500">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300">/</span>}
              <span className={i === breadcrumb.length - 1 ? 'text-gray-900 font-medium' : 'hover:text-gray-700 cursor-pointer'}>
                {crumb.label}
              </span>
            </span>
          ))}
        </div>
      )}

      <div className="flex-1" />

      {/* Search */}
      <div className="relative">
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:block">Search…</span>
          <span className="hidden sm:flex items-center gap-0.5 ml-1 text-xs text-gray-300">
            <Command className="h-3 w-3" />K
          </span>
        </button>

        {showSearch && (
          <div className="absolute top-0 right-0 z-50">
            <div className="fixed inset-0 bg-black/20" onClick={() => { setShowSearch(false); setSearchQuery(''); }} />
            <div className="relative bg-white rounded-xl border border-gray-200 shadow-xl w-96">
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, clients, tasks…"
                  className="flex-1 text-sm outline-none placeholder:text-gray-400"
                />
                <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              {searchResults.length > 0 ? (
                <div className="py-1">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 text-left"
                      onClick={() => { navigate(r.path); setShowSearch(false); setSearchQuery(''); }}
                    >
                      <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400 w-14 shrink-0">{r.type}</span>
                      <span className="text-sm text-gray-900">{r.label}</span>
                    </button>
                  ))}
                </div>
              ) : searchQuery.length > 1 ? (
                <p className="px-4 py-6 text-sm text-gray-400 text-center">No results for "{searchQuery}"</p>
              ) : (
                <div className="px-4 py-6 text-sm text-gray-400 text-center">Start typing to search</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifs(!showNotifs)}
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {showNotifs && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-100 shadow-xl z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-xs hover:underline" style={{ color: 'var(--gold-dark)' }}>Mark all read</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.slice(0, 10).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={cn('px-4 py-3 cursor-pointer hover:bg-gray-50', !notif.read && 'bg-amber-50/50')}
                  >
                    <div className="flex items-start gap-2">
                      {!notif.read && <div className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ background: 'var(--gold)' }} />}
                      <div className={!notif.read ? '' : 'pl-4'}>
                        <p className="text-xs font-medium text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{formatDate(notif.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors"
        >
          <Avatar name={currentUser?.name || 'User'} size="xs" />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-gray-900 leading-none">{currentUser?.name}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{currentUser?.role.replace('_', ' ')}</p>
          </div>
          <ChevronDown className="h-3 w-3 text-gray-400" />
        </button>

        {showUserMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-xl z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
              <div className="py-1">
                <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Switch Role</p>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => { setCurrentUser(u.id); setShowUserMenu(false); }}
                    className={cn('flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50', u.id === currentUserId && 'font-medium')}
                    style={u.id === currentUserId ? { color: 'var(--gold-dark)' } : {}}
                  >
                    <Avatar name={u.name} size="xs" />
                    <div className="text-left">
                      <p className="text-xs font-medium">{u.name}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{u.role.replace('_', ' ')}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
