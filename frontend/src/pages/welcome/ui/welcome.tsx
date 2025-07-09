import s from './welcome.module.scss';

export const WelcomePage = () => {
    return (
        <div className={s.container}>
            <header className={s.header}>
                <a href="#" className={s.logo}>Friends.com</a>

                <div className={s.social_media}>
                    <a href="https://t.me/social_net_friends">
                        <i className="bx bxl-telegram"></i>
                    </a>
                    <a href="https://vk.com/club226890161">
                        <i className='bx bxl-vk'></i>
                    </a>
                </div>

                <nav className={s.navbar}>
                    <a href="#">Destinations</a>
                    <a href="#">Booking</a>
                    <a href="#">Services</a>
                    <a href="#">Contact</a>
                </nav>
            </header>

            <section className={s.banner}>
                <div className={s.slider}>
                    <div className={s.slide}>
                        <div className={s.left_info}>
                            <div className={s.penetrate_blur}>
                                <h1>Friends</h1>
                            </div>
                            <div className={s.content}>
                                <h3>Friends.com - New Social Network</h3>
                                <p>
                                    Friends.com - это новая социальная сеть, которая стремится стать номером 1 в списке
                                    социальных сетей.
                                    Она предлагает возможность общаться и переписываться друг с другом. Friends.com
                                    предлагает ряд функций,
                                    которые делают ее привлекательной для пользователей. Friends.com стремится
                                    предоставить пользователям
                                    удобную и безопасную платформу для общения и обмена информацией. Она предлагает
                                    множество функций,
                                    которые делают ее привлекательной для пользователей, и стремится стать лидером среди
                                    социальных сетей.
                                </p>
                                <button className={s.btn}>Messenger</button>
                            </div>
                        </div>
                        <div className={s.right_info}>
                            <h1>.com</h1>
                            <h3>Social Network</h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};