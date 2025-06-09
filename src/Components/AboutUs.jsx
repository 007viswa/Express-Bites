import React from 'react';
import Header from './Header'; // This import should now correctly point to your new Header.jsx
import Footer from './Footer'; // Import the Footer component
// No need to import LoginPopup here unless AboutUs directly triggers it

const AboutUs = ({onSignInClick}) => {
  
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Pass onSignInClick to the Header */}
      <Header onSignInClick={onSignInClick} />

      <main style={{
        flexGrow: 1,
        padding: '40px 20px',
        backgroundColor: '#fff',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Your existing AboutUs page content goes here */}
        <header style={{
          textAlign: 'center',
          marginBottom: '60px',
        }}>
          <h1 style={{
            fontSize: '3.5em',
            color: '#f77024',
            marginBottom: '15px',
          }}>About ExpressBite</h1>
          <p style={{
            fontSize: '1.3em',
            color: '#555',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            Connecting you with the best local flavors, delivered fresh and fast.
          </p>
        </header>

        <section style={{
          maxWidth: '1000px',
          margin: '0 auto 60px auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '40px',
          padding: '30px',
          backgroundColor: '#fdf3ed',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        }}>
          <div style={{ flex: '1 1 45%' }}>
            <h2 style={{
              fontSize: '2.2em',
              color: '#f77024',
              marginBottom: '20px',
            }}>Our Story</h2>
            <p style={{ fontSize: '1.1em', marginBottom: '15px' }}>
              ExpressBite was founded on the simple idea that great food should be accessible to everyone,
              anytime, anywhere. What started as a small team with a big vision has grown into a thriving
              platform serving communities and supporting countless local restaurants. We're passionate
              about food, technology, and making people happy.
            </p>
            <p style={{ fontSize: '1.1em' }}>
              From humble beginnings to becoming a go-to for food delivery, our journey has been driven by
              a commitment to quality, efficiency, and exceptional customer service.
            </p>
          </div>
          <div style={{ flex: '1 1 45%', textAlign: 'center' }}>
            <img
              src="../../ourStory.png"
              alt="ExpressBite Story"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </div>
        </section>

        <section style={{
          maxWidth: '1000px',
          margin: '0 auto 60px auto',
          padding: '30px',
        }}>
          <h2 style={{
            fontSize: '2.2em',
            color: '#f77024',
            marginBottom: '30px',
            textAlign: 'center',
          }}>Our Core Values</h2>
          <ul style={{
            listStyle: 'none',
            padding: '0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '30px',
          }}>
            <li style={{
              flex: '1 1 280px',
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              borderBottom: '5px solid #f77024',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: '1.5em', color: '#f77024', marginBottom: '10px' }}>Innovation</h3>
              <p>
                Constantly evolving to provide a seamless and intuitive ordering experience.
              </p>
            </li>
            <li style={{
              flex: '1 1 280px',
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              borderBottom: '5px solid #f77024',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: '1.5em', color: '#f77024', marginBottom: '10px' }}>Reliability</h3>
              <p>
                Ensuring your orders are accurate and delivered on time, every time.
              </p>
            </li>
            <li style={{
              flex: '1 1 280px',
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              borderBottom: '5px solid #f77024',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: '1.5em', color: '#f77024', marginBottom: '10px' }}>Community</h3>
              <p>
                Building strong relationships with our restaurant partners and customers.
              </p>
            </li>
          </ul>
        </section>

        <section style={{
          maxWidth: '1000px',
          margin: '0 auto 60px auto',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: '2.2em',
            color: '#f77024',
            marginBottom: '30px',
          }}>Meet Our Team</h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '30px',
          }}>
            {/* Team Member: SAI POORNESH KAVILI */}
            <div style={{
              flex: '1 1 250px',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              border: '1px solid #eee',
            }}>
              <h3 style={{ fontSize: '1.4em', color: '#333', marginBottom: '5px' }}>Sai Poornesh Kavili</h3>
              <p style={{ color: '#f77024', fontWeight: 'bold' }}>Developer</p>
              <p style={{ fontSize: '0.95em', color: '#666' }}>
                A key contributor to the ExpressBite platform's development.
              </p>
            </div>

            {/* Team Member: CHETTY VARDHAN GOUD */}
            <div style={{
              flex: '1 1 250px',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              border: '1px solid #eee',
            }}>
              <h3 style={{ fontSize: '1.4em', color: '#333', marginBottom: '5px' }}>Chetty Vardhan Goud</h3>
              <p style={{ color: '#f77024', fontWeight: 'bold' }}>Developer</p>
              <p style={{ fontSize: '0.95em', color: '#666' }}>
                Bringing innovative solutions to enhance user experience.
              </p>
            </div>

            {/* Team Member: VINISHA KRISHNAN */}
            <div style={{
              flex: '1 1 250px',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              border: '1px solid #eee',
            }}>
              <h3 style={{ fontSize: '1.4em', color: '#333', marginBottom: '5px' }}>Vinisha Krishnan</h3>
              <p style={{ color: '#f77024', fontWeight: 'bold' }}>Developer</p>
              <p style={{ fontSize: '0.95em', color: '#666' }}>
                Dedicated to building robust and scalable features.
              </p>
            </div>

            {/* Team Member: SRI HARI VISWANATH */}
            <div style={{
              flex: '1 1 250px',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              border: '1px solid #eee',
            }}>
              <h3 style={{ fontSize: '1.4em', color: '#333', marginBottom: '5px' }}>Sri Hari Viswanath</h3>
              <p style={{ color: '#f77024', fontWeight: 'bold' }}>Developer</p>
              <p style={{ fontSize: '0.95em', color: '#666' }}>
                Ensuring high-quality code and seamless functionality.
              </p>
            </div>

            {/* Team Member: PADMAPRIYA MAHALINGAM */}
            <div style={{
              flex: '1 1 250px',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              border: '1px solid #eee',
            }}>
              <h3 style={{ fontSize: '1.4em', color: '#333', marginBottom: '5px' }}>Padmapriya Mahalingam</h3>
              <p style={{ color: '#f77024', fontWeight: 'bold' }}>Developer</p>
              <p style={{ fontSize: '0.95em', color: '#666' }}>
                Passionate about delivering efficient and reliable software.
              </p>
            </div>
          </div>
        </section>

        <section style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          paddingBottom: '40px',
        }}>
          <h2 style={{
            fontSize: '2.2em',
            color: '#f77024',
            marginBottom: '20px',
          }}>Join the ExpressBite Family!</h2>
          <p style={{
            fontSize: '1.1em',
            marginBottom: '30px',
          }}>
            Whether you're looking to enjoy delicious food or become a partner, we welcome you.
          </p>
          <a href="/" style={{ // Consider using Link here if '/' is an internal route
            display: 'inline-block',
            backgroundColor: '#f77024',
            color: '#fff',
            padding: '15px 30px',
            fontSize: '1.1em',
            textDecoration: 'none',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease',
            marginRight: '20px',
          }}>
            Order Now
          </a>
          <a href="/partner-with-us" style={{ // Consider using Link here
            display: 'inline-block',
            backgroundColor: '#fff',
            color: '#f77024',
            border: '2px solid #f77024',
            padding: '15px 30px',
            fontSize: '1.1em',
            textDecoration: 'none',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}>
            Partner With Us
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;