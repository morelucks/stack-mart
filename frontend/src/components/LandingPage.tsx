import { WalletButton } from './WalletButton';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage = ({ onEnter }: LandingPageProps) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f7f7f2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      paddingBottom: '3rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-50px, -50px) rotate(360deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>

      {/* Top navigation like Marketplace Naija */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5de' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo / brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '2px solid #1a7f1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1a7f1a',
              fontSize: '1.1rem'
            }}>
              🛍️
            </div>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#145214'
            }}>
              StackMart Naija
            </span>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.95rem' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#145214',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onClick={onEnter}
            >
              Sign in or Register
            </button>
            <button
              onClick={onEnter}
              style={{
                backgroundColor: '#26a626',
                border: 'none',
                color: '#ffffff',
                fontWeight: 600,
                padding: '0.6rem 1.4rem',
                borderRadius: '999px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}
            >
              + Place Your Listing
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#145214' }}>
              <span>My Account</span>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid #cfd8cf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem'
              }}>
                🔔
              </span>
            </div>
          </div>
        </div>

        {/* Green search bar */}
        <div style={{ backgroundColor: '#2bbe2b', padding: '0.9rem 0' }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'grid',
            gridTemplateColumns: '3fr 2fr 2fr auto',
            gap: '0.5rem',
          }}>
            <input
              placeholder="What are you looking for?"
              style={{
                borderRadius: '4px',
                border: 'none',
                padding: '0.6rem 0.75rem',
                fontSize: '0.95rem'
              }}
            />
            <select
              style={{
                borderRadius: '4px',
                border: 'none',
                padding: '0.6rem 0.75rem',
                fontSize: '0.95rem',
                appearance: 'none'
              }}
              defaultValue=""
            >
              <option value="" disabled>Select Category</option>
              <option value="nfts">NFTs</option>
              <option value="music">Music Rights</option>
              <option value="art">Digital Art</option>
              <option value="templates">Code & Templates</option>
            </select>
            <select
              style={{
                borderRadius: '4px',
                border: 'none',
                padding: '0.6rem 0.75rem',
                fontSize: '0.95rem',
                appearance: 'none'
              }}
              defaultValue=""
            >
              <option value="" disabled>Location</option>
              <option value="lagos">Lagos</option>
              <option value="abuja">Abuja</option>
              <option value="portharcourt">Port Harcourt</option>
              <option value="others">Other Cities</option>
            </select>
            <button
              onClick={onEnter}
              style={{
                backgroundColor: '#176a17',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.6rem 1.4rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              🔍 Search
            </button>
          </div>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        width: '100%',
        zIndex: 1,
        textAlign: 'center',
        margin: '3rem auto 0',
        padding: '0 1.5rem'
      }}>
        {/* Logo/Title */}
        <div className="fade-in-up" style={{
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: '1rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em'
          }}>
            🛍️ StackMart
          </h1>
          <p style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            color: '#3b3b3b',
            marginBottom: '0.5rem',
            fontWeight: 300
          }}>
            Decentralized Marketplace on Stacks
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#555555',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Buy and sell digital goods as NFTs with built-in licensing, escrow, and automatic royalty splits
          </p>
        </div>

        {/* Features Grid */}
        <div className="fade-in-up" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
          marginTop: '3rem'
        }}>
          {[
            { icon: '🔐', title: 'Secure Escrow', desc: 'Smart contracts handle payments safely' },
            { icon: '💰', title: 'Auto Royalties', desc: 'Automatic splits to collaborators' },
            { icon: '⭐', title: 'Reputation System', desc: 'On-chain seller/buyer ratings' },
            { icon: '⚖️', title: 'Dispute Resolution', desc: 'Community-powered arbitration' },
            { icon: '📦', title: 'Bundles & Packs', desc: 'Curated collections with discounts' },
            { icon: '🌐', title: 'Multi-Wallet', desc: 'Support for all major wallets' }
          ].map((feature, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                {feature.icon}
              </div>
              <h3 style={{
                color: '#1a1a1a',
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: '#555555',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="fade-in-up" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button
              onClick={onEnter}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#ffffff',
                background: '#26a626',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
              }}
            >
              🚀 Enter Marketplace
            </button>
            
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '0.5rem 1rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <WalletButton />
            </div>
          </div>

          <p style={{
            color: '#555555',
            fontSize: '0.9rem',
            marginTop: '1rem'
          }}>
            Connect your wallet to start buying and selling digital goods
          </p>
        </div>

        {/* Stats */}
        <div className="fade-in-up" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          marginTop: '4rem',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Blockchain', value: 'Stacks' },
            { label: 'Payments', value: 'STX' },
            { label: 'Smart Contracts', value: 'Clarity' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1a1a1a',
                marginBottom: '0.25rem'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#555555'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

