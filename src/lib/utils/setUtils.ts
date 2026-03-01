import type { CardSet } from '$lib/types/cardTypes';

export const SET_CLASS: Record<CardSet, string> = {
	PPSM: 'bg-set-spanish-main',
	PPCC: 'bg-set-crimson-coast',
	PPRV: 'bg-set-revolution'
};

export const SET_LABEL: Record<CardSet, string> = {
	PPSM: 'Spanish Main',
	PPCC: 'Crimson Coast',
	PPRV: 'Revolution'
};
