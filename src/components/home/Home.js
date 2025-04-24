import CountUp from "react-countup";
import React from 'react';
import './Home.css';

function Home() {

return (
    <div className="home-container">
        <div className="content-container">
            <div className="text-content">
                <header>
                    <h1 className="align-center">Welcome to</h1>
                    <h2>VNRVJIET</h2>
                </header>
                <section className="content fs-6 text-align-center">
                    <p>The Philosophy of Vignana Jyothi unravels education as a process of "Presencing" that provides, both individually and collectively, to one's deepest capacity to sense and experience the knowledge and activities to shape the future. Based on a synthesis of direct experience, leading edge thinking and ancient wisdom, it taps into 'deeper levels of LEARNING for discovering new possibilities'.<br></br>
                    <br></br>

Today, with this philosophy, Vignana Jyothi has created an edifice that is strong in its foundations, which can only rise higher and higher. Quality and integrity is the essence for achieving excellence at Vignana Jyothi Institutions. This and quest for excellence reflects in the vision and mission. Their passion reflects in the enterprise of education.</p>
                </section>
            </div>
            <div className="image-content">
                <img src="https://vnrvjiet.ac.in/assets/images/Landing%20image.png" alt="VNRVJIET" />
            </div>
        </div>

        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <div className="card cc card1 h-100">
                        <div className="card-body">
                            {/* <img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/course-1648742-1400672.png" className='logo pic'></img> */}
                            <h5 className="card-title oo bg-dark fs-3 text-white rounded-2">Vision</h5>
                            <p className="card-text overflow-auto">
                            To be a World Class University providing value-based education, conducting interdisciplinary research in cutting edge technologies leading to sustainable socio-economic development of the nation.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card cc h-100">
                        <div className="card-body">
                            {/* <img src="https://cdn-icons-png.flaticon.com/512/1591/1591045.png" className='logo1 pic'></img> */}
                            <h5 className="card-title oo bg-dark  fs-3 text-white rounded-2">Mission</h5>

                            <p className="card-text">
                            To produce technically competent and socially responsible engineers, managers and entrepreneurs, who will be future ready.
                    To involve students and faculty in innovative research projects linked with industry, academic and research institutions in India and abroad.
                    To use modern pedagogy for improving the teaching-learning process.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card cc card1 h-100">
                        <div className="card-body">
                            {/* <img src="https://cdn4.iconfinder.com/data/icons/gamification-flat/64/learning-idea-knowledge-solve-experience-512.png" className='logo2 pic'></img> */}
                            <h5 className="card-title bg-dark text-white fs-3 oo rounded-2">Quality Policy</h5>
                            <p className="card-text justify-content-center">
                            Impart up-to-date knowledge in the students' chosen fields to make them quality engineers
Make the students experience the applications on quality equipment and tools
Provide quality environment and services to all stakeholders
Provide systems, resources and opportunities for continuous improvement
Maintain global standards in education, training and services
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            <br />
            <br />
        </div>

        <div className="container">
            <div className="circles">
                <div className="circle">
                    <CountUp
                        start={0}
                        end={7722}
                        delay={0}
                        enableScrollSpy={true}
                        scrollSpyDelay={500}
                    >
                        {({ countUpRef }) => (
                            <div className="counter">
                                <span ref={countUpRef} />+
                            </div>
                        )}
                    </CountUp>
                    <span className="circle-name">

                        Students
                    </span>
                </div>
                <div className="line" />
                <div className="circle">
                    <CountUp
                        start={0}
                        end={100}
                        delay={0}
                        enableScrollSpy={true}
                        scrollSpyDelay={500}
                    >
                        {({ countUpRef }) => (
                            <div className="counter">
                                <span ref={countUpRef} />+
                            </div>
                        )}
                    </CountUp>
                    <span className="circle-name">
                        Companies
                    </span>
                </div>

                <div className="line" />
                <div className="circle">
                    <CountUp
                        start={0}
                        end={25}
                        delay={0}
                        enableScrollSpy={true}
                        scrollSpyDelay={500}
                    >
                        {({ countUpRef }) => (
                            <div className="counter">
                                <span ref={countUpRef} />+
                            </div>
                        )}
                    </CountUp>
                    <span className="circle-name">
                        MNCs
                    </span>
                </div>

            </div>
        </div>


    </div>
);
}

export default Home;