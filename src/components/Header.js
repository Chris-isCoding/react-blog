import { FaLaptop, FaTabletAlt, FaMobileAlt } from 'react-icons/fa';

const Header = ({ title, width }) => {
  console.log(width);
  return (
    <header className='Header'>
      <h1>{title}</h1>
      {width < 768 ? (
        <FaMobileAlt />
      ) : width < 992 ? (
        <FaTabletAlt />
      ) : (
        <FaLaptop />
      )}
    </header>
  );
};

export default Header;
