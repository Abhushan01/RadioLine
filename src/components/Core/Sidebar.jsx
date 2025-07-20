// src/components/Core/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { SidebarLinks } from '../../constants/SidebarLinks';
import '../../styles/Sidebar.css';

const Sidebar = ({ mobile = false }) => {
  const { mainLinks, userLibLinks } = SidebarLinks[0];

  // ─── Mobile Icon Bar ─────────────────────────────────────────────────────────
  if (mobile) {
    const allLinks = [...mainLinks, ...userLibLinks];
    return (
      <aside
        className="
          bg-[var(--color-navigation-section)]
          backdrop-blur-xl
          rounded-sm
          w-full
          py-2
        "
      >
        <nav className="flex justify-around items-center">
          {allLinks.map(({ icon: Icon, targetLink }, idx) => (
            <NavLink
              to={targetLink}
              className={({ isActive }) => `${isActive ? 'active-mobile' : ''}`}
            >
              <button key={idx} className="p-2 bg-transparent">
                <Icon className="w-6 h-6 " />
              </button>
            </NavLink>
          ))}
        </nav>
      </aside>
    );
  }

  // ─── Desktop Sidebar (exactly as your original) ─────────────────────────────
  return (
    <aside
      className="
        bg-[var(--color-navigation-section)]
        backdrop-blur-xl
        py-4
        rounded-sm
        fixed
        lg:w-66
        md:w-35
        h-full
        z-50
        md:text-sm
        lg:text-base
      "
    >
      <nav className="space-y-6 text-[var(--color-text-primary)]">
        {/* Main Links */}
        <ul className="space-y-3">
          {mainLinks.map(({ label, icon: Icon, targetLink }, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <NavLink to={targetLink} className={'w-full'}>
                <button className="flex lg:gap-3 md:gap-2 items-center w-full">
                  <Icon className="w-5 h-5" />
                  <div className="text-left uppercase">{label}</div>
                </button>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <hr className="border-[var(--color-border)]" />

        <p className="text-[var(--color-text-secondary)] mb-2 pl-4">Your Library</p>

        {/* User Library Links */}
        <ul className="space-y-3">
          {userLibLinks.map(({ label, icon: Icon, targetLink }, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <NavLink to={targetLink} className={'w-full'}>
                <button className="bg-transparent flex lg:gap-3 md:gap-2 items-center w-full">
                  <Icon className="w-5 h-5" />
                  <div className="text-left uppercase">{label}</div>
                </button>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
