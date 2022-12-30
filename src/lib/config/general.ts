import type { ThemeConfig, HeadConfig, HeaderConfig, FooterConfig, DateConfig, FeedConfig } from '$lib/types/general'

export const theme: ThemeConfig = [
	{
		name: 'cmyk',
		text: '🖨 Light'
	},
	{
		name: 'dracula',
		text: '🧛 Dark'
	},
	{
		name: 'valentine',
		text: '🌸 Valentine'
	},
	{
		name: 'aqua',
		text: '💦 Aqua'
	},
	{
		name: 'synthwave',
		text: '🌃 Synthwave'
	},
	{
		name: 'night',
		text: '🌃 Night'
	},
	{
		name: 'lofi',
		text: '🎶 Lo-Fi'
	},
	{
		name: 'lemonade',
		text: '🍋 Lemonade'
	},
	{
		name: 'cupcake',
		text: '🧁 Cupcake'
	},
	{
		name: 'garden',
		text: '🏡 Garden'
	},
	{
		name: 'retro',
		text: '🌇 Retro'
	},
	{
		name: 'black',
		text: '🖤 Black'
	}
]

export const head: HeadConfig = {}

export const header: HeaderConfig = {
	nav: [
		{
			text: 'Welcome Web3 Writeup',
			link: '/Welcome Web3'
		},
		{
			text: 'Yogosha Christmans CTF 21',
			link: '/Yogosha Christmans CTF 21'
		}
	]
}

export const footer: FooterConfig = {
	nav: [
		{
			text: 'Feed',
			link: '/atom.xml'
		},
		{
			text: 'Sitemap',
			link: '/sitemap.xml'
		}
	]
}

export const date: DateConfig = {
	locales: 'en-US',
	options: {
        year: 'numeric', // Year: `numeric`, `2-digit
		weekday: 'long', // Week: `narrow`, `short`, `long`
		month: 'short', // Month: `numeric`, `2-digit`, `narrow`, `short`, `long`
		day: 'numeric' // day: `numeric`, `2-digit`
	}
}

export const feed: FeedConfig = {}
