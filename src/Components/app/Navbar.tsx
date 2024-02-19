import { useState } from "react";
import Icons from "../utils/Icons";
import { useLocation, useNavigate } from "react-router-dom";

type TPages = "link" | "user";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<TPages>(() => {
    return location.pathname.includes("profile") ? "user" : "link";
  });

  return (
    <nav className="fixed top-0 left-0 right-0 py-4 px-6 flex justify-between items-center bg-white z-20 shadow-lg shadow-neutral-300/20">
      <Icons icon="logo" />
      <div>
        <NavbarLinkButton
          to="link"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <NavbarLinkButton
          to="user"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <button
        onClick={() => {
          console.log("test");
          navigate("/preview");
        }}
      >
        <Icons icon="eye" />
      </button>
    </nav>
  );
}

/*
#633CFF
#BEADFF
*/

function NavbarLinkButton({
  currentPage,
  setCurrentPage,
  to,
}: {
  currentPage: TPages;
  setCurrentPage: React.Dispatch<React.SetStateAction<TPages>>;
  to: TPages;
}) {
  const navigate = useNavigate();
  return (
    <button
      className="py-3 px-6 rounded-lg"
      style={{ background: currentPage === to ? "#EFEBFF" : "none" }}
      onClick={() => {
        setCurrentPage(to);
        navigate(`/app/${to === "user" ? "profile" : "link"}`);
      }}
    >
      <Icons icon={to} color={currentPage === to ? "#633CFF" : "none"} />
    </button>
  );
}
