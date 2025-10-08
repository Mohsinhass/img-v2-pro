import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../utils/db';

const Header = ({ processingFiles = [], onTabChange }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth?.() || { user: null, loading: false, signOut: () => {} };
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Load profile when user is available
  useEffect(() => {
    let active = true;
    async function load() {
      if (!user) { setProfile(null); setProfileLoading(false); return; }
      try {
        setProfileLoading(true);
        const p = await getMyProfile();
        if (!active) return;
        setProfile(p);
        setAvatarError(false);
      } catch {
        // ignore profile load errors in header
      } finally {
        if (active) setProfileLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);
  
  const navigationItems = [
    {
      label: 'Home',
      path: '/image-conversion-hub',
      icon: 'Upload',
      tooltip: 'Go to Convert Page',
      primary: true
    },
    {
      label: 'About',
      path: '/about',
      icon: 'Info',
      tooltip: 'About Img V2 Pro',
      primary: true
    },
    {
      label: 'Contact',
      path: '/contact',
      icon: 'Mail',
      tooltip: 'Contact Us',
      primary: true
    },
    {
      label: 'Updates',
      path: '/updates',
      icon: 'Sparkles',
      tooltip: 'What’s new',
      primary: true
    },
    {
      label: 'Price',
      path: '/premium-features',
      icon: 'Crown',
      tooltip: 'View pricing and plans',
      primary: true
    }
  ];

  const isActiveTab = (path) => {
    if (path === '/image-conversion-hub' && location?.pathname === '/') return true;
    return location?.pathname === path;
  };

  const handleTabClick = (item) => {
    if (onTabChange) {
      onTabChange(item);
    }
    setIsMobileMenuOpen(false);
  };

  const processingCount = processingFiles?.length;
  const hasProcessing = processingCount > 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-background border-b border-border elevation-2">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6 w-full relative">
        {/* Left: Brand / Logo */}
        <div className="flex items-center min-w-[48px]">
          <Link to="/" className="flex items-center group" title="Home">
            <img
              src="/img/logo.png"
              alt="Logo"
              className="h-8 w-auto select-none"
              draggable="false"
            />
          </Link>
        </div>

  {/* Desktop Navigation - Centered absolutely */}
  <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          {navigationItems?.map((item) => {
            const isActive = isActiveTab(item?.path);
            return (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => handleTabClick(item)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-150 hover-scale focus-ring
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }
                `}
                title={item?.tooltip}
              >
                <Icon 
                  name={item?.icon} 
                  size={16} 
                  strokeWidth={2}
                  className={isActive ? 'text-primary-foreground' : 'text-current'}
                />
                <span>{item?.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Auth, Processing Status & Mobile Menu */}
        <div className="flex items-center space-x-3 min-w-[180px] justify-end">
          {/* Processing Indicator */}
          {hasProcessing && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-primary">
                Processing {processingCount} file{processingCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Auth controls */}
          {!loading && (
            user ? (
              <div className="hidden md:flex items-center gap-2 relative" ref={menuRef}>
                {/* Avatar button */}
                <button
                  className="w-9 h-9 rounded-full border border-border overflow-hidden focus-ring bg-muted"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  {profileLoading ? (
                    <div className="w-full h-full animate-pulse" />
                  ) : profile?.avatar_url ? (
                    avatarError ? (
                      <div className="w-full h-full flex items-center justify-center text-text-secondary">
                        <Icon name="User" size={16} />
                      </div>
                    ) : (
                      <img
                        src={profile?.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={() => setAvatarError(true)}
                        referrerPolicy="no-referrer"
                      />
                    )
                  ) : (
                    <img
                      src={'/img/icon.jpg'}
                      alt="Profile default"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (!e?.currentTarget?.dataset?.fallbackApplied) {
                          e.currentTarget.dataset.fallbackApplied = '1';
                          e.currentTarget.src = '/img/icon.png';
                        }
                      }}
                    />
                  )}
                </button>
                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-popover text-popover-foreground border border-border rounded-md shadow-lg py-1 z-50">
                    <Link to="/account" className="block px-3 py-2 text-sm hover:bg-muted" onClick={() => setMenuOpen(false)}>
                      Account
                    </Link>
                    <Link to="/settings" className="block px-3 py-2 text-sm hover:bg-muted" onClick={() => setMenuOpen(false)}>
                      Settings
                    </Link>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted" onClick={() => { setMenuOpen(false); signOut?.(); }}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/auth/sign-in" className="text-sm text-text-secondary hover:text-text-primary">Sign In</Link>
                <Link to="/auth/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="px-4 py-3 space-y-1">
            {navigationItems?.map((item) => {
              const isActive = isActiveTab(item?.path);
              return (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => handleTabClick(item)}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150 focus-ring
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                    }
                  `}
                >
                  <Icon 
                    name={item?.icon} 
                    size={18} 
                    strokeWidth={2}
                    className={isActive ? 'text-primary-foreground' : 'text-current'}
                  />
                  <div className="flex flex-col">
                    <span>{item?.label}</span>
                    <span className="text-xs opacity-75">{item?.tooltip}</span>
                  </div>
                </Link>
              );
            })}
            
            {/* Mobile Processing Status */}
            {hasProcessing && (
              <div className="flex items-center space-x-3 px-3 py-2.5 mt-2 bg-primary/10 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-primary">
                  Processing {processingCount} file{processingCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Mobile Auth controls */}
            {!loading && (
              user ? (
                <div className="flex items-center justify-between px-3 py-2.5 mt-2 bg-muted rounded-lg gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full border overflow-hidden bg-muted">
                      {profileLoading ? (
                        <div className="w-full h-full animate-pulse" />
                      ) : profile?.avatar_url ? (
                        avatarError ? (
                          <div className="w-full h-full flex items-center justify-center text-text-secondary">
                            <Icon name="User" size={14} />
                          </div>
                        ) : (
                          <img
                            src={profile?.avatar_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={() => setAvatarError(true)}
                          />
                        )
                      ) : (
                        <img
                          src={'/img/icon.jpg'}
                          alt="Profile default"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (!e?.currentTarget?.dataset?.fallbackApplied) {
                              e.currentTarget.dataset.fallbackApplied = '1';
                              e.currentTarget.src = '/img/icon.png';
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to="/account" className="text-sm text-text-secondary hover:text-text-primary" onClick={() => setIsMobileMenuOpen(false)}>Account</Link>
                    <Link to="/settings" className="text-sm text-text-secondary hover:text-text-primary" onClick={() => setIsMobileMenuOpen(false)}>Settings</Link>
                    <Button size="xs" variant="ghost" onClick={() => { signOut?.(); setIsMobileMenuOpen(false); }}>Sign Out</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-3 py-2.5 mt-2 bg-muted rounded-lg">
                  <Link to="/auth/sign-in" className="text-sm text-text-secondary hover:text-text-primary" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="xs">Sign Up</Button>
                  </Link>
                </div>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;