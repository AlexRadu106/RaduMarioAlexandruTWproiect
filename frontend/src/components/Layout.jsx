import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

function navClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

export default function Layout() {
  return (
    <>
      <nav className={styles.navBar}>
        <NavLink to="/" end className={navClass}>
          Lista Vehiculelor
        </NavLink>
        <NavLink to="/despre" className={navClass}>
          Despre Proiect
        </NavLink>
      </nav>

      <div className={styles.content}>
        <Outlet />
      </div>
    </>
  );
}