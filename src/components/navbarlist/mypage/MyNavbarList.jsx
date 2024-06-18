import "../ListBox.css";

export default function MyNavbarList({ mileage }) {
return (
    <div>
      <div
        className="navbar__list__item"
      >
        하루 마일리지: {mileage} / 100
      </div>
    </div>
  );
}
