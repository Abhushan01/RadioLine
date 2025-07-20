import { SidebarLinks } from '../constants/SidebarLinks';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { mainLinks, userLibLinks } = SidebarLinks[0]; // assuming only one object in array

  return (
    <aside className="bg-[var(--color-navigation-section)] backdrop-blur-xl py-4 rounded-sm fixed w-66 z-50 h-full ">
      <nav className="space-y-6 text-[var(--color-text-primary)]">
        {/* Main Links */}
        <ul className="space-y-3">
          {mainLinks.map(({ label, icon: Icon }, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <button className="bg-transparent flex gap-3 items-center w-100">
                <Icon className="w-5 h-5" />
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <hr className="border-[var(--color-border)]" />
        <p className="text-[var(--color-text-secondary)] mb-2 pl-4">Your Library</p>
        {/* User Library Links */}
        <ul className="space-y-3">
          {userLibLinks.map(({ label, icon: Icon }, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <button className="bg-transparent flex gap-3 items-center w-100">
                <Icon className="w-5 h-5" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
