import { NextRequest, NextResponse } from 'next/server'



export async function GET(req: NextRequest) {

  try {

    const { searchParams } = new URL(req.url)

    const lat = searchParams.get('lat')

    const lng = searchParams.get('lng')



    if (!lat || !lng) {

      return NextResponse.json({ error: 'Location required' }, { status: 400 })

    }



    const response = await fetch(

      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=doctor&keyword=dermatologist&key=${process.env.GOOGLE_MAPS_API_KEY}`

    )



    const data = await response.json()



    const derms = data.results.map((place: any) => ({

      id: place.place_id,

      name: place.name,

      address: place.vicinity,

      rating: place.rating,

      total_ratings: place.user_ratings_total,

      open_now: place.opening_hours?.open_now,

      photo: place.photos?.[0]?.photo_reference

        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`

        : null,

      lat: place.geometry.location.lat,

      lng: place.geometry.location.lng,

    }))



    return NextResponse.json({ success: true, derms })

  } catch (error) {

    console.error('Derms error:', error)

    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 })

  }

}