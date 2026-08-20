import React from 'react';
import { AdminDashboardView } from './components/AdminDashboardView';
import { CoachesManagementView } from './components/CoachesManagementView';
import { Header } from './components/Header';
import { PlayerDashboardView } from './components/PlayerDashboardView';
import { PlayerPortalView } from './components/PlayerPortalView';
import { PlayerSettingsProfileView } from './components/PlayerSettingsProfileView';
import { RadioPelotaModal } from './components/RadioPelotaModal';
import { RbacMatrixModal } from './components/RbacMatrixModal';
import { RosterView } from './components/RosterView';
import { ScoutBookView } from './components/ScoutBookView';
import { ScoutPortalView } from './components/ScoutPortalView';
import { SettingsStaffView } from './components/SettingsStaffView';
import { ShowcaseView } from './components/ShowcaseView';
import { Sidebar } from './components/Sidebar';
import { StaffDashboardView } from './components/StaffDashboardView';
import { StudioEdTechView } from './components/StudioEdTechView';
import { BibliotecaView } from './components/studio/BibliotecaView';
import { SavantStudioView } from './components/studio/SavantStudioView';
import { BaseballIqFlowView } from './components/studio/BaseballIqFlowView';
import { StudioAssignmentsView } from './components/studio/StudioAssignmentsView';
import { TrajectoryProgramsView } from './components/trajectory/TrajectoryProgramsView';
import { TrajectoryTournamentsView } from './components/trajectory/TrajectoryTournamentsView';
import { TrajectoryMetricsView } from './components/trajectory/TrajectoryMetricsView';
import { TrajectoryCoachingView } from './components/trajectory/TrajectoryCoachingView';
import { TrajectoryShowcasesView } from './components/trajectory/TrajectoryShowcasesView';
import { TrajectoryEducationView } from './components/trajectory/TrajectoryEducationView';
import { TrajectoryCoursesView } from './components/trajectory/TrajectoryCoursesView';
import { COACHES_STAFF, MOCK_ACADEMY, MOCK_PLAYERS } from './data/mockData';
import { AcademyProfile, CoachStaff, Player, UserRole } from './types';

export default function App() {
  // Global Application State
  const [activeRole, setActiveRole] = React.useState<UserRole>('admin');
  const [currentTab, setCurrentTab] = React.useState<string>('dashboard');
  const [academy, setAcademy] = React.useState<AcademyProfile>(MOCK_ACADEMY);
  const [players, setPlayers] = React.useState<Player[]>(MOCK_PLAYERS);
  const [coaches, setCoaches] = React.useState<CoachStaff[]>(academy.staffList || COACHES_STAFF);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);

  // Search & Mobile UI State
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isOpenMobile, setIsOpenMobile] = React.useState<boolean>(false);

  // Modals
  const [isRbacModalOpen, setIsRbacModalOpen] = React.useState<boolean>(false);
  const [isRadioPelotaOpen, setIsRadioPelotaOpen] = React.useState<boolean>(false);

  // Live Audio Streaming for Radio Pelota (https://stream.antenne.com/antenne-nds/mp3-192)
  const [isRadioPlaying, setIsRadioPlaying] = React.useState<boolean>(false);
  const [isRadioBuffering, setIsRadioBuffering] = React.useState<boolean>(false);
  const [radioMuted, setRadioMuted] = React.useState<boolean>(false);
  const [radioVolume, setRadioVolume] = React.useState<number>(0.85);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const PRIMARY_STREAM_URL = 'https://stream.antenne.com/antenne-nds/mp3-192';

  // Toggle live radio stream with fresh connection handling
  const toggleRadioStream = () => {
    // If currently playing, stop and cleanly disconnect the live stream socket
    if (isRadioPlaying && audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      } catch (e) {
        console.warn('Error stopping stream:', e);
      }
      setIsRadioPlaying(false);
      setIsRadioBuffering(false);
      return;
    }

    // Initialize fresh audio instance for live broadcast
    if (!audioRef.current) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;

      audio.onplaying = () => {
        setIsRadioPlaying(true);
        setIsRadioBuffering(false);
      };

      audio.onwaiting = () => {
        setIsRadioBuffering(true);
      };

      audio.onpause = () => {
        setIsRadioPlaying(false);
        setIsRadioBuffering(false);
      };

      audio.onerror = (e) => {
        console.warn('Radio stream error, reconnecting...', e);
        setIsRadioBuffering(true);
        // Attempt fresh reconnect with cache-busting timestamp
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.src = `${PRIMARY_STREAM_URL}?_t=${Date.now()}`;
            audioRef.current.load();
            audioRef.current.play().catch((err) => {
              console.warn('Fallback stream play attempt:', err);
              setIsRadioPlaying(false);
              setIsRadioBuffering(false);
            });
          }
        }, 800);
      };
    }

    const audio = audioRef.current;
    setIsRadioBuffering(true);
    setIsRadioPlaying(true);

    // Fresh live stream URL with timestamp to prevent stale browser buffer
    audio.src = `${PRIMARY_STREAM_URL}?_live=${Date.now()}`;
    audio.volume = radioVolume;
    audio.muted = radioMuted;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsRadioPlaying(true);
          setIsRadioBuffering(false);
        })
        .catch((err) => {
          console.warn('Initial play promise rejected, trying plain URL:', err);
          audio.src = PRIMARY_STREAM_URL;
          audio.load();
          audio
            .play()
            .then(() => {
              setIsRadioPlaying(true);
              setIsRadioBuffering(false);
            })
            .catch((finalErr) => {
              console.error('Audio playback failed:', finalErr);
              setIsRadioPlaying(false);
              setIsRadioBuffering(false);
            });
        });
    }
  };

  const handleOpenRadioPelota = () => {
    toggleRadioStream();
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !radioMuted;
      audioRef.current.muted = nextMuted;
      setRadioMuted(nextMuted);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setRadioVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol > 0 && radioMuted) {
        audioRef.current.muted = false;
        setRadioMuted(false);
      }
    }
  };

  // Active Linked Player for B2C simulation (Bryan Grano)
  const activePlayer = players[0] || MOCK_PLAYERS[0];

  // Role Switcher handler
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'admin') {
      setCurrentTab('admin-dashboard');
    } else if (role === 'staff') {
      setCurrentTab('staff-dashboard');
    } else if (role === 'scout') {
      setCurrentTab('scout-portal');
    } else if (role === 'player') {
      setCurrentTab('player-dashboard');
    }
  };

  const handleUpdatePlayerScore = (playerId: string, newScore: number) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? {
              ...p,
              edTech: {
                ...p.edTech,
                baseballIqScore: newScore,
                lastIqTestDate: new Date().toISOString().split('T')[0],
              },
            }
          : p
      )
    );
  };

  const handleUpdateSinglePlayer = (updated: Player) => {
    setPlayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleUpdateCoaches = (updatedCoaches: CoachStaff[]) => {
    setCoaches(updatedCoaches);
    setAcademy((prev) => ({
      ...prev,
      staffList: updatedCoaches,
      totalStaffCount: updatedCoaches.length,
    }));
  };

  const handleSelectPlayerFromSearch = (player: Player) => {
    setSelectedPlayer(player);
    setCurrentTab('roster');
  };

  // Helper to determine active dashboard by role
  const isDashboardTab =
    currentTab === 'dashboard' ||
    currentTab === 'admin-dashboard' ||
    currentTab === 'staff-dashboard' ||
    currentTab === 'player-dashboard';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Left Sidebar (Fixed on desktop, drawer on mobile) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeRole={activeRole}
        academy={academy}
        activePlayer={activePlayer}
        onOpenRadioPelota={handleOpenRadioPelota}
        onOpenRbacModal={() => setIsRbacModalOpen(true)}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        isRadioPlaying={isRadioPlaying}
      />

      {/* 2. Main Layout Container (Offset by sidebar width on lg screens) */}
      <div className="flex-1 flex flex-col lg:pl-72 min-h-screen">
        {/* Header with Search & RBAC Simulator */}
        <Header
          activeRole={activeRole}
          setActiveRole={handleRoleChange}
          academy={academy}
          activePlayer={activePlayer}
          onOpenRadioPelota={() => setIsRadioPelotaOpen(true)}
          onOpenRbacModal={() => setIsRbacModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenMobileMenu={() => setIsOpenMobile(true)}
          onSelectPlayer={handleSelectPlayerFromSearch}
          allPlayers={players}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20">
          {/* A. DASHBOARDS POR ROL */}
          {isDashboardTab && (
            <>
              {activeRole === 'admin' && (
                <AdminDashboardView
                  academy={academy}
                  players={players}
                  coaches={coaches}
                  onNavigateTab={setCurrentTab}
                  onSelectPlayer={(p) => {
                    setSelectedPlayer(p);
                    setCurrentTab('roster');
                  }}
                  onOpenRadioPelota={() => setIsRadioPelotaOpen(true)}
                  onOpenRbacModal={() => setIsRbacModalOpen(true)}
                />
              )}

              {activeRole === 'staff' && (
                <StaffDashboardView
                  academy={academy}
                  players={players}
                  onNavigateTab={setCurrentTab}
                  onSelectPlayer={(p) => {
                    setSelectedPlayer(p);
                    setCurrentTab('roster');
                  }}
                />
              )}

              {activeRole === 'scout' && (
                <ScoutPortalView
                  academy={academy}
                  players={players}
                  onSelectPlayer={(p) => {
                    setSelectedPlayer(p);
                    setCurrentTab('roster');
                  }}
                  onNavigateTab={setCurrentTab}
                />
              )}

              {activeRole === 'player' && (
                <PlayerDashboardView
                  academy={academy}
                  player={activePlayer}
                  onUpdatePlayer={handleUpdateSinglePlayer}
                  onNavigateTab={setCurrentTab}
                  onOpenRadioPelota={() => setIsRadioPelotaOpen(true)}
                />
              )}
            </>
          )}

          {/* B. ROSTER DE ATLETAS & VISTA 360° (ACCESIBLE PARA DIRECTOR Y ENTRENADORES) */}
          {currentTab === 'roster' && (
            <RosterView
              players={players}
              onUpdatePlayers={setPlayers}
              activeRole={activeRole}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
              onNavigateTab={setCurrentTab}
            />
          )}

          {/* C. STUDIO / EDTECH / BIOMECÁNICA / TESTS IQ */}
          {(currentTab === 'baseball-iq' ||
            currentTab === 'biomechanics' ||
            currentTab === 'studio' ||
            currentTab === 'library' ||
            currentTab === 'iq-history') && (
            <StudioEdTechView
              players={players}
              activeRole={activeRole}
              activePlayer={activePlayer}
              onUpdatePlayerScore={handleUpdatePlayerScore}
              subTab={currentTab}
            />
          )}

          {/* D. SCOUT BOOK GENERATOR (PDF MARCA BLANCA) */}
          {currentTab === 'scout-book' && (
            <ScoutBookView
              academy={academy}
              players={players}
              activeRole={activeRole}
            />
          )}

          {/* E. SHOWCASES & COMBINES */}
          {currentTab === 'showcases' && (
            <ShowcaseView
              academy={academy}
              players={players}
              coaches={coaches}
              activeRole={activeRole}
              onNavigateTab={setCurrentTab}
              onUpdatePlayer={handleUpdateSinglePlayer}
            />
          )}

          {/* F. PORTAL DE SCOUT MLB */}
          {currentTab === 'scout-portal' && (
            <ScoutPortalView
              academy={academy}
              players={players}
              onSelectPlayer={(p) => {
                setSelectedPlayer(p);
                setCurrentTab('roster');
              }}
              onNavigateTab={setCurrentTab}
            />
          )}

          {/* G. PERFIL DEL JUGADOR, TUTOR LEGAL, VISIBILIDAD, ACCESO & SUSCRIPCIÓN (IDÉNTICO A LA ESTRUCTURA DE LA ACADEMIA) */}
          {currentTab === 'player-portal' && (
            <PlayerSettingsProfileView
              player={activePlayer}
              academy={academy}
              activeRole={activeRole}
              onUpdatePlayer={handleUpdateSinglePlayer}
              onOpenRbacModal={() => setIsRbacModalOpen(true)}
              onNavigateTab={setCurrentTab}
            />
          )}

          {/* H. GESTIÓN DE ENTRENADORES (CRUD MULTI-ESPECIALIDAD) */}
          {currentTab === 'coaches' && (
            <CoachesManagementView
              coaches={coaches}
              onUpdateCoaches={handleUpdateCoaches}
              players={players}
            />
          )}

          {/* I. CONFIGURACIÓN INSTITUCIONAL, SERVICIOS & SUSCRIPCIÓN B2B */}
          {currentTab === 'settings' && (
            <SettingsStaffView
              academy={academy}
              players={players}
              activeRole={activeRole}
              onUpdateAcademy={setAcademy}
              onOpenRbacModal={() => setIsRbacModalOpen(true)}
              onNavigateToCoaches={() => setCurrentTab('coaches')}
            />
          )}

          {/* I. MÓDULOS DE TRAYECTORIA Y PERFIL PROSPECTO (B2C & INSTITUCIONAL) */}
          {currentTab === 'programs' && (
            <TrajectoryProgramsView
              player={activePlayer}
              onUpdatePlayer={handleUpdateSinglePlayer}
            />
          )}

          {currentTab === 'tournaments' && (
            <TrajectoryTournamentsView
              player={activePlayer}
              onUpdatePlayer={handleUpdateSinglePlayer}
            />
          )}

          {currentTab === 'metrics' && (
            <TrajectoryMetricsView
              player={activePlayer}
              onUpdatePlayer={handleUpdateSinglePlayer}
            />
          )}

          {(currentTab === 'coaching' || currentTab === 'coaching-sessions') && (
            <TrajectoryCoachingView
              player={activePlayer}
              onUpdatePlayer={handleUpdateSinglePlayer}
            />
          )}

          {(currentTab === 'showcase-history' || currentTab === 'tryouts') && (
            <TrajectoryShowcasesView
              player={activePlayer}
              onUpdatePlayer={handleUpdateSinglePlayer}
            />
          )}

          {currentTab === 'education' && (
            <TrajectoryEducationView
              player={activePlayer}
              onUpdatePlayer={handleUpdateSinglePlayer}
            />
          )}

          {currentTab === 'courses' && (
            <TrajectoryCoursesView
              player={activePlayer}
              onUpdatePlayer={handleUpdateSinglePlayer}
            />
          )}

          {/* J. STUDIO: ASIGNACIONES, SEGUIMIENTO 360, BIBLIOTECA, SAVANT & EDTECH TOOLS */}
          {(currentTab === 'studio-assignments' || currentTab === 'assignments' || currentTab === 'studio-tracking') && (
            <StudioAssignmentsView
              academy={academy}
              players={players}
              activeRole={activeRole}
              currentTab={currentTab}
              onUpdatePlayer={handleUpdateSinglePlayer}
              onNavigateTab={setCurrentTab}
            />
          )}

          {(currentTab === 'biblioteca' || currentTab === 'library' || currentTab === 'studio-library') && (
            <BibliotecaView
              player={activePlayer}
              onOpenRadioPelota={() => setIsRadioPelotaOpen(true)}
              onUpdatePlayer={handleUpdateSinglePlayer}
            />
          )}

          {(currentTab === 'savant' || currentTab === 'studio-savant') && (
            <SavantStudioView
              player={activePlayer}
              onUpdatePlayer={handleUpdateSinglePlayer}
            />
          )}

          {(currentTab === 'studio-test' || currentTab === 'studio-iq' || currentTab === 'baseball-iq') && (
            <BaseballIqFlowView
              player={activePlayer}
              onUpdatePlayer={handleUpdateSinglePlayer}
            />
          )}

          {currentTab === 'studio' && (
            <StudioEdTechView
              players={players}
              activeRole={activeRole}
              activePlayer={activePlayer}
              subTab="baseball-iq"
              onUpdatePlayerScore={(playerId, newScore) => {
                const updated = players.map(p => p.id === playerId ? { ...p, baseballIqScore: newScore } : p);
                setPlayers(updated);
              }}
            />
          )}
        </main>
      </div>

      {/* 3. Global Modals */}
      <RbacMatrixModal
        isOpen={isRbacModalOpen}
        onClose={() => setIsRbacModalOpen(false)}
        activeRole={activeRole}
        setActiveRole={handleRoleChange}
      />

      <RadioPelotaModal
        isOpen={isRadioPelotaOpen}
        onClose={() => setIsRadioPelotaOpen(false)}
        isPlaying={isRadioPlaying}
        onTogglePlay={toggleRadioStream}
        isMuted={radioMuted}
        onToggleMute={handleToggleMute}
        volume={radioVolume}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}
