
import React from 'react';
import '../styles/custom.css';
import heroImg from '../assets/food-hero.jpg';
import food1 from '../assets/food2.jpg';
import food2 from '../assets/food3.jpg';

const Home = () => {
  return (
    <>
      <header className="bg-dark text-white text-center py-5" style={{ backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container py-5 bg-dark bg-opacity-75 rounded">
          <h1 className="display-4 fw-bold">FlavourFusion</h1>
          <p className="lead">Savor the taste of deliciousness at your doorstep!</p>
          <a href="/login" className="btn btn-warning btn-lg mt-3">Get Started</a>
        </div>
      </header>

      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Why Choose Us?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Multiple Restaurants</h5>
                  <p className="card-text">Partnered with top-rated local and global kitchens.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Lightning Fast</h5>
                  <p className="card-text">We ensure hot and fresh food arrives in minutes.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Track Everything</h5>
                  <p className="card-text">From order to delivery, see every step live.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 text-center">
        <div className="container">
          <h2 className="fw-bold mb-4">Popular Picks</h2>
          <div className="row">
            <div className="col-md-6 mb-3">
              <img src={food1} alt="Popular Dish" className="img-fluid rounded shadow" />
            </div>
            <div className="col-md-6 mb-3">
              <img src={food2} alt="Popular Dish" className="img-fluid rounded shadow" />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">&copy; 2025 FlavourFusion</p>
      </footer>
    </>
  );
};

export default Home;
