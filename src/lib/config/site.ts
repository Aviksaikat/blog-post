import type { SiteConfig } from '$lib/types/site'

export const site: SiteConfig = {
  protocol: 'https://',
  domain: import.meta.env.URARA_SITE_DOMAIN ?? 'urara-demo.netlify.app',
  title: 'Home',
  subtitle: 'Personal Blog',
  lang: 'en-US',
  description: '',
	author: {
		name: 'Saikat Karmakar',
		avatar: '/assets/profile.jpeg', // author image
		status: '👽',
		bio: 'Cyber Security Enthusiast, eJPT, CTF player, Yogosha Member, Learning blockchain & smart contracts pentesting, TryHackme Top 1500 Global. Red Team guy with a keen interest in Blue Teaming(I.e. Purple team)'

	},
  themeColor: '#3D4451'
}
