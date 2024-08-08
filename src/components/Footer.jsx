import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <div className='container-footer'>
        <h6>&copy; {new Date().getFullYear()} PokeApi </h6>
      </div>
    </footer>
  );
};

export default Footer;
