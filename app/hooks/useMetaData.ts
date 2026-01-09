'use client'

import { useQuery } from '@tanstack/react-query'

export function useMetaCampaigns(datePreset: string) {
  return useQuery({
    queryKey: ['meta-campaigns', datePreset],
    queryFn: async () => {
      const response = await fetch(`/api/meta/campaigns?date_preset=${datePreset}`)
      if (!response.ok) throw new Error('Failed to fetch campaigns')
      return response.json()
    },
  })
}

export function useMetaAdSets(datePreset: string) {
  return useQuery({
    queryKey: ['meta-adsets', datePreset],
    queryFn: async () => {
      const response = await fetch(`/api/meta/adsets?date_preset=${datePreset}`)
      if (!response.ok) throw new Error('Failed to fetch adsets')
      return response.json()
    },
  })
}

export function useMetaAds(datePreset: string) {
  return useQuery({
    queryKey: ['meta-ads', datePreset],
    queryFn: async () => {
      const response = await fetch(`/api/meta/ads?date_preset=${datePreset}`)
      if (!response.ok) throw new Error('Failed to fetch ads')
      return response.json()
    },
  })
}

export function useMetaInsights(datePreset: string) {
  return useQuery({
    queryKey: ['meta-insights', datePreset],
    queryFn: async () => {
      const response = await fetch(`/api/meta/insights?datePreset=${datePreset}`)
      if (!response.ok) throw new Error('Failed to fetch insights')
      return response.json()
    },
  })
}
