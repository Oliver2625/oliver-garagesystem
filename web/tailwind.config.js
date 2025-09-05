/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
				'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
				'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
				'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
				'none': 'none',
			},
			dropShadow: {
				'sm': '0 1px 1px rgb(0 0 0 / 0.05)',
				'DEFAULT': ['0 1px 2px rgb(0 0 0 / 0.1)', '0 1px 1px rgb(0 0 0 / 0.06)'],
				'md': ['0 4px 3px rgb(0 0 0 / 0.07)', '0 2px 2px rgb(0 0 0 / 0.06)'],
				'lg': ['0 10px 8px rgb(0 0 0 / 0.04)', '0 4px 3px rgb(0 0 0 / 0.1)'],
				'xl': ['0 20px 13px rgb(0 0 0 / 0.03)', '0 8px 5px rgb(0 0 0 / 0.08)'],
				'2xl': '0 25px 25px rgb(0 0 0 / 0.15)',
				'none': 'none',
			},
			backdropBlur: {
				'sm': '4px',
				'DEFAULT': '8px',
				'md': '12px',
				'lg': '16px',
				'xl': '24px',
				'2xl': '40px',
				'3xl': '64px',
			},
			backdropSaturate: {
				'0': '0',
				'50': '.5',
				'100': '1',
				'150': '1.5',
				'200': '2',
			},
			backdropBrightness: {
				'0': '0',
				'50': '.5',
				'75': '.75',
				'90': '.9',
				'95': '.95',
				'100': '1',
				'105': '1.05',
				'110': '1.1',
				'125': '1.25',
				'150': '1.5',
				'200': '2',
			},
			backdropContrast: {
				'0': '0',
				'50': '.5',
				'75': '.75',
				'100': '1',
				'125': '1.25',
				'150': '1.5',
				'200': '2',
			},
			backdropGrayscale: {
				'0': '0',
				'DEFAULT': '100%',
			},
			backdropHueRotate: {
				'0': '0deg',
				'15': '15deg',
				'30': '30deg',
				'60': '60deg',
				'90': '90deg',
				'180': '180deg',
			},
			backdropInvert: {
				'0': '0',
				'DEFAULT': '100%',
			},
			backdropOpacity: {
				'0': '0',
				'5': '0.05',
				'10': '0.1',
				'20': '0.2',
				'25': '0.25',
				'30': '0.3',
				'40': '0.4',
				'50': '0.5',
				'60': '0.6',
				'70': '0.7',
				'75': '0.75',
				'80': '0.8',
				'90': '0.9',
				'95': '0.95',
				'100': '1',
			},
			backdropSepia: {
				'0': '0',
				'DEFAULT': '100%',
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
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
			}
		}
	},
	plugins: [
		require('tailwindcss-animate')
	],
}

