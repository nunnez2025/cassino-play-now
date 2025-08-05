
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		fontFamily: {
			'joker': ['Creepster', 'cursive'],
			'horror': ['Nosifer', 'cursive'], 
			'gothic': ['Griffy', 'cursive'],
			'eater': ['Eater', 'cursive'],
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				joker: {
					purple: 'hsl(280 100% 50%)',
					'purple-dark': 'hsl(280 100% 35%)',
					green: 'hsl(120 100% 50%)',
					'green-dark': 'hsl(120 100% 35%)',
					gold: 'hsl(45 100% 70%)',
					'gold-dark': 'hsl(45 100% 50%)',
					black: 'hsl(0 0% 8%)',
					dark: 'hsl(255 15% 15%)',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-joker': 'linear-gradient(135deg, hsl(280 100% 50%) 0%, hsl(280 100% 35%) 100%)',
				'gradient-purple': 'linear-gradient(135deg, hsl(280 100% 50%) 0%, hsl(280 100% 35%) 100%)',
				'gradient-green': 'linear-gradient(135deg, hsl(120 100% 50%) 0%, hsl(120 100% 35%) 100%)',
				'gradient-gold': 'linear-gradient(135deg, hsl(45 100% 70%) 0%, hsl(45 100% 50%) 100%)',
				'gradient-dark': 'linear-gradient(135deg, hsl(255 15% 15%) 0%, hsl(0 0% 8%) 100%)',
			},
			boxShadow: {
				'joker': '0 4px 20px rgba(138, 43, 226, 0.5)',
				'neon': '0 0 20px hsl(280 100% 50%), 0 0 40px hsl(280 100% 50%)',
				'green': '0 4px 20px hsl(120 100% 50%), 0 0 30px hsl(120 100% 50%)',
				'gold': '0 4px 20px hsl(45 100% 70%), 0 0 30px hsl(45 100% 70%)',
				'glow': '0 0 30px hsl(45 100% 70%), 0 0 50px hsl(280 100% 50%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
