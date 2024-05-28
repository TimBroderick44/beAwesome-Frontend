import style from './LandingPage.module.scss'
import Logo from '../../assets/exericse.jpg'

const LandingPage = () => {
  return (
      <div className={style.container}>
          <h1 className={style.heading}> Todo: Be Awesome!</h1>
          <img className={style.img} src={Logo} alt="logo" />
          <p className={style.text}>....Time to start building on a better you!</p>
</div>
  );
};

export default LandingPage;