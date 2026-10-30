import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { OrderStatus } from '../../data/types'
import { StatusBadge } from './StatusBadge'
import { MapGraphic } from './MapGraphic'

interface LagosMapProps {
  pickupAddress?: string
  deliveryAddress?: string
  status?: OrderStatus
  riderLocation?: { lat: number; lng: number }
  className?: string
  height?: string
}

// Known Lagos coordinates database [lng, lat]
const LAGOS_COORDINATES: Record<string, [number, number]> = {
  ikeja: [3.3515, 6.5965],
  allen: [3.3562, 6.6012],
  alausa: [3.3621, 6.6190],
  maryland: [3.3667, 6.5724],
  ojota: [3.3831, 6.5828],
  anthony: [3.3712, 6.5621],
  gbagada: [3.3883, 6.5556] as [number, number],
  yaba: [3.3792, 6.5095],
  surulere: [3.3581, 6.4975],
  oshodi: [3.3421, 6.5569],
  agege: [3.3217, 6.6180],
  magodo: [3.3768, 6.6214],
  ogudu: [3.3934, 6.5752],
  lekki: [3.4700, 6.4474],
  'lekki phase 1': [3.4650, 6.4485],
  ikate: [3.4912, 6.4402],
  jakande: [3.5183, 6.4385],
  chevron: [3.5350, 6.4362],
  'victoria island': [3.4219, 6.4281],
  vi: [3.4219, 6.4281],
  ikoyi: [3.4398, 6.4549],
  marina: [3.3958, 6.4531],
  'lagos island': [3.3920, 6.4550],
  apapa: [3.3619, 6.4452],
  festac: [3.2842, 6.4673],
  amuwo: [3.2985, 6.4682],
  ajah: [3.5658, 6.4698],
  sangotedo: [3.6120, 6.4715],
  ikorodu: [3.5106, 6.6194],
  egbeda: [3.2891, 6.5950],
  alimosho: [3.2721, 6.6020],
}

/**
 * Resolves an address string to approximate [lng, lat] in Lagos.
 */
function resolveLagosCoords(address?: string, fallback: [number, number] = [3.3792, 6.5095]): [number, number] {
  if (!address) return fallback
  const clean = address.toLowerCase()
  for (const [key, coords] of Object.entries(LAGOS_COORDINATES)) {
    if (clean.includes(key)) {
      return coords
    }
  }
  return fallback
}

function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

export function LagosMap({
  pickupAddress,
  deliveryAddress,
  status,
  riderLocation,
  className = '',
  height = '240px',
}: LagosMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const [webGlSupported] = useState<boolean>(() => isWebGLAvailable())
  const [mapLoaded, setMapLoaded] = useState(false)

  const pickupCoords = resolveLagosCoords(pickupAddress, [3.3515, 6.5965]) // Default Ikeja
  const deliveryCoords = resolveLagosCoords(deliveryAddress, [3.4700, 6.4474]) // Default Lekki

  useEffect(() => {
    if (!webGlSupported || !mapContainer.current) return

    try {
      // Initialize map with OpenFreeMap liberty style
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [(pickupCoords[0] + deliveryCoords[0]) / 2, (pickupCoords[1] + deliveryCoords[1]) / 2],
        zoom: 11.5,
        attributionControl: false,
      })

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

      map.on('load', () => {
        setMapLoaded(true)

        // Add Pickup Marker (Green)
        const pickupEl = document.createElement('div')
        pickupEl.className = 'custom-map-marker pickup-marker'
        pickupEl.innerHTML = `
          <div style="background-color: #16a34a; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;">
            P
          </div>
        `
        new maplibregl.Marker({ element: pickupEl })
          .setLngLat(pickupCoords)
          .setPopup(new maplibregl.Popup({ offset: 15 }).setHTML(`<strong>Pickup:</strong><br/>${pickupAddress || 'Origin'}`))
          .addTo(map)

        // Add Delivery Marker (Red)
        const deliveryEl = document.createElement('div')
        deliveryEl.className = 'custom-map-marker delivery-marker'
        deliveryEl.innerHTML = `
          <div style="background-color: #dc2626; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;">
            D
          </div>
        `
        new maplibregl.Marker({ element: deliveryEl })
          .setLngLat(deliveryCoords)
          .setPopup(new maplibregl.Popup({ offset: 15 }).setHTML(`<strong>Drop-off:</strong><br/>${deliveryAddress || 'Destination'}`))
          .addTo(map)

        // Rider Marker (Danfo Yellow Motorcycle)
        const showRider = status === 'PICKED_UP' || status === 'OUT_FOR_DELIVERY' || Boolean(riderLocation)
        const rCoords: [number, number] = riderLocation
          ? [riderLocation.lng, riderLocation.lat]
          : [
              pickupCoords[0] + (deliveryCoords[0] - pickupCoords[0]) * 0.45,
              pickupCoords[1] + (deliveryCoords[1] - pickupCoords[1]) * 0.45,
            ]

        if (showRider) {
          const riderEl = document.createElement('div')
          riderEl.className = 'custom-map-marker rider-marker'
          riderEl.innerHTML = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <span style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background-color: rgba(245, 158, 11, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <div style="background-color: #D99F16; color: #1A1A1A; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(217, 159, 22, 0.6); border: 2.5px solid white; z-index: 2;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18.5" cy="17.5" r="3.5"/>
                  <circle cx="5.5" cy="17.5" r="3.5"/>
                  <circle cx="15" cy="5" r="1"/>
                  <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
                </svg>
              </div>
            </div>
          `
          new maplibregl.Marker({ element: riderEl })
            .setLngLat(rCoords)
            .setPopup(new maplibregl.Popup({ offset: 15 }).setHTML('<strong>Eko-Rider</strong><br/>Live dispatch in transit'))
            .addTo(map)
        }

        // Draw delivery connecting route line
        const routeCoordinates = showRider
          ? [pickupCoords, rCoords, deliveryCoords]
          : [pickupCoords, deliveryCoords]

        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: routeCoordinates,
            },
          },
        })

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#D99F16',
            'line-width': 4,
            'line-dasharray': [2, 2],
          },
        })

        // Fit map bounds to show all markers
        const bounds = new maplibregl.LngLatBounds()
        bounds.extend(pickupCoords)
        bounds.extend(deliveryCoords)
        if (showRider) bounds.extend(rCoords)

        map.fitBounds(bounds, {
          padding: 45,
          maxZoom: 14,
          duration: 1000,
        })
      })

      mapInstance.current = map

      return () => {
        map.remove()
      }
    } catch (e) {
      console.warn('MapLibre GL initialization error:', e)
    }
  }, [pickupAddress, deliveryAddress, status, riderLocation, webGlSupported, pickupCoords, deliveryCoords])

  // Fallback to static stylized SVG graphic if WebGL is unavailable
  if (!webGlSupported) {
    return <MapGraphic status={status} className={className} />
  }

  // Google Maps navigation link
  const navUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    pickupAddress || 'Lagos, Nigeria'
  )}&destination=${encodeURIComponent(deliveryAddress || 'Lagos, Nigeria')}`

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-neutral-200/80 shadow-inner ${className}`}
      style={{ height, minHeight: '180px' }}
    >
      <div ref={mapContainer} className="h-full w-full" />

      {/* Loading state indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
            <svg className="h-4 w-4 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading Lagos Live Map...
          </div>
        </div>
      )}

      {/* Status Badge overlay */}
      {status && (
        <div className="absolute right-3 top-3 z-10 pointer-events-none">
          <StatusBadge status={status} />
        </div>
      )}

      {/* Lagos Navigation button overlay */}
      <div className="absolute left-3 bottom-3 z-10">
        <a
          href={navUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900/80 px-2.5 py-1 text-[11px] font-semibold text-white shadow backdrop-blur transition hover:bg-neutral-900 active:scale-95"
          title="Open directions in Google Maps"
        >
          <svg className="h-3 w-3 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          Navigate
        </a>
      </div>

      {/* MapLibre / OpenFreeMap attribution badge */}
      <div className="absolute right-2 bottom-1 z-10 text-[9px] text-neutral-400 bg-white/70 px-1 rounded pointer-events-none">
        © OpenFreeMap • OSM
      </div>
    </div>
  )
}
