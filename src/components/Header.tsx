import React from 'react';
import {
  Bell,
  Check,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Shield,
  Sparkles,
  X
} from 'lucide-react';
import { AcademyProfile, Player, UserRole } from '../types';

interface HeaderProps {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  academy: AcademyProfile;
  activePlayer: Player;
  onOpenRadioPelota?: () => void;
  onOpenRbacModal?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenMobileMenu: () => void;
  onSelectPlayer: (player: Player) => void;
  allPlayers: Player[];
}

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'scout' | 'video' | 'showcase' | 'iq';
  read: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  setActiveRole,
  searchQuery,
  setSearchQuery,
  onOpenMobileMenu,
  onSelectPlayer,
  allPlayers,
}) => {
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'Donny Rowland (Scout MLB) añadió a Carlos Rosario a su lista de seguimiento.',
      time: 'Hace 15 min',
      type: 'scout',
      read: false,
    },
    {
      id: 'n-2',
      title: 'Nuevo reporte biomecánico 3D procesado para Maikol Orozco.',
      time: 'Hace 1 hora',
      type: 'video',
      read: false,
    },
    {
      id: 'n-3',
      title: 'Confirmación de registro para MLB International Showcase 2026.',
      time: 'Hace 3 horas',
      type: 'showcase',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    // Visual feedback of logout and reset to default role
    setActiveRole('admin');
  };

  const searchResults = searchQuery.trim()
    ? allPlayers.filter(
        (p) =>
          p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.signingClass.includes(searchQuery) ||
          p.hometown.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const rolesConfig: Array<{
    id: UserRole;
    label: string;
    badge: string;
    sub: string;
  }> = [
    {
      id: 'admin',
      label: 'Administrador de academia',
      badge: 'Control Total',
      sub: 'Gestión suscripción, staff, roster consolidado',
    },
    {
      id: 'staff',
      label: 'Entrenador / Staff',
      badge: 'Métricas & Studio',
      sub: 'Carga de métricas, test de IQ, videoanálisis',
    },
    {
      id: 'scout',
      label: 'Scout MLB (Invitado Externo)',
      badge: 'Vista Externa',
      sub: 'Scout Cards verificadas, radar 20-80, reportes',
    },
    {
      id: 'player',
      label: 'Jugador / Prospecto (B2C)',
      badge: 'Perfil Vinculado',
      sub: 'Progreso propio, test de IQ, cursos, Radio Pelota',
    },
  ];

  const currentRoleObj = rolesConfig.find((r) => r.id === activeRole)!;

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Mobile Hamburger toggle */}
      <div className="flex items-center lg:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Spacer on Desktop */}
      <div className="hidden lg:block" />

      {/* Right Section: Search Box + Notifications + Logout + Role Switcher */}
      <div className="flex items-center justify-end gap-2.5 sm:gap-3 flex-1 max-w-2xl ml-auto">
        {/* Search Bar for Prospects */}
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Buscar prospecto por nombre, posición..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 max-h-72 overflow-y-auto">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">
                Resultados ({searchResults.length})
              </div>
              {searchResults.map((player) => (
                <button
                  key={player.id}
                  onClick={() => {
                    onSelectPlayer(player);
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={player.avatar}
                      alt={player.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{player.fullName}</p>
                      <p className="text-[11px] text-slate-500">
                        {player.position} • Clase {player.signingClass} • {player.hometown}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-blue-600">
                      {player.glovallScore}
                    </span>
                    <p className="text-[10px] text-slate-400">Score</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 1. Notifications Bell Button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
            }}
            title="Notificaciones"
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 hover:border-slate-300 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notificaciones</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black">
                      {unreadCount} nuevas
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Marcar leídas
                  </button>
                )}
              </div>

              <div className="py-2 space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2.5 ${
                      n.read ? 'bg-slate-50/60 text-slate-600' : 'bg-blue-50/70 text-slate-900 font-medium'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="leading-snug text-xs">{n.title}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Logout Button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            title="Cerrar sesión"
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 hover:border-rose-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50/60 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Role Switcher Option */}
        <div className="relative shrink-0">
          <button
            id="rbac-role-switcher-btn"
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold truncate max-w-[100px] sm:max-w-[150px]">
              {currentRoleObj.label.split('(')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Role selection dropdown */}
          {showRoleMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">Cambiar de Rol</p>
                <p className="text-[11px] text-slate-500">
                  Selecciona la perspectiva que deseas visualizar:
                </p>
              </div>

              <div className="space-y-1">
                {rolesConfig.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setActiveRole(role.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                      activeRole === role.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        activeRole === role.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {role.id === 'admin' ? '👑' : role.id === 'staff' ? '📋' : role.id === 'scout' ? '🔭' : '⚾'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {role.label}
                        </span>
                        {activeRole === role.id && (
                          <span className="text-[10px] font-bold text-blue-600">Activo</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{role.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">¿Cerrar Sesión?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Se guardarán todos los cambios en tu bitácora de la academia. Podrás volver a ingresar en cualquier momento.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
