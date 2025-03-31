// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary)',
                'primary-dark': 'var(--primary-dark)'
            },
            keyframes: {
                'float-1': {
                    '0%, 100%': { transform: 'translateY(0) translateX(0)' },
                    '50%': { transform: 'translateY(-20px) translateX(10px)' },
                },
                'float-2': {
                    '0%, 100%': { transform: 'translateY(0) translateX(0)' },
                    '50%': { transform: 'translateY(20px) translateX(-10px)' },
                },
                'float-3': {
                    '0%, 100%': { transform: 'translateY(0) rotate(0)' },
                    '50%': { transform: 'translateY(-15px) rotate(5deg)' },
                }
            },
            animation: {
                'rotate-slow': 'rotate 60s linear infinite',
                'float-1': 'float-1 6s ease-in-out infinite',
                'float-2': 'float-2 8s ease-in-out infinite',
                'float-3': 'float-3 7s ease-in-out infinite',
            }
        }
    }
}