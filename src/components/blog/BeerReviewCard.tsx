import { BeerReview } from '@/lib/types/blog'
import { getABVBadgeColors } from '@/lib/utils'
import { MapPin, Zap, ExternalLink, Award, Calendar, Thermometer } from 'lucide-react'
import Image from 'next/image'
import StarRating from '@/components/ui/StarRating'

interface BeerReviewCardProps {
  review: BeerReview
  size?: 'small' | 'medium' | 'large'
}

export default function BeerReviewCard({ review, size = 'medium' }: BeerReviewCardProps) {
  // Create brewery website URL from brewery name for Alabama breweries
  const getBreweryWebsite = (breweryName: string) => {
    const breweryUrls: Record<string, string> = {
      'Good People Brewing Company': 'https://goodpeoplebrewing.com',
      'Yellowhammer Brewing': 'https://yellowhammerbrewery.com',
      'Cahaba Brewing Company': 'https://cahababrewing.com',
      'TrimTab Brewing Company': 'https://trimtabbrewing.com',
      'Avondale Brewing Company': 'https://avondalebrewing.com',
      'Back Forty Beer Company': 'https://backfortybeer.com',
      'Monday Night Brewing (Birmingham Social Club)': 'https://mondaynight.beer/birmingham'
    }
    return breweryUrls[breweryName] || review.brewery_website
  }

  const breweryWebsite = getBreweryWebsite(review.brewery_name)

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-beer-amber/40 transform hover:-translate-y-1 overflow-hidden">
      {/* Hero Image Section */}
      <div className="relative h-64 bg-gradient-to-br from-beer-amber/20 via-beer-gold/10 to-beer-cream">
        {review.image_url ? (
          <Image
            src={review.image_url}
            alt={`${review.beer_name} by ${review.brewery_name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-beer-amber/20 rounded-full p-8">
              <Zap className="w-16 h-16 text-beer-amber" />
            </div>
          </div>
        )}
        
        {/* Rating Overlay */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <StarRating 
            rating={review.rating} 
            size="medium"
            showNumber={true}
          />
        </div>

        {/* Beer Style Badge */}
        <div className="absolute top-4 left-4 bg-beer-dark/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {review.beer_style}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-beer-dark mb-2 leading-tight">
            {review.beer_name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-beer-amber">
                {review.brewery_name}
              </p>
              {breweryWebsite && (
                <a 
                  href={breweryWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-beer-amber hover:text-beer-gold transition-colors p-1 hover:bg-beer-cream rounded-full"
                  title={`Visit ${review.brewery_name} website`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            {review.brewery_location && (
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{review.brewery_location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Beer Specs */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {review.abv && (
            (() => {
              const abvColors = getABVBadgeColors(review.abv);
              return (
                <div className={`flex items-center gap-1 ${abvColors.bg} px-3 py-2 rounded-lg border ${abvColors.border}`}>
                  <Thermometer className={`w-4 h-4 ${abvColors.text}`} />
                  <span className={`font-semibold ${abvColors.text} text-sm`}>
                    {review.abv}% ABV
                  </span>
                </div>
              );
            })()
          )}
          
          {review.ibu && (
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
              <Award className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-orange-600 text-sm">
                {review.ibu} IBU
              </span>
            </div>
          )}
        </div>

        {/* Tasting Notes */}
        {review.tasting_notes && (
          <div className="mb-4">
            <h4 className="font-semibold text-beer-dark mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-beer-amber" />
              Tasting Notes
            </h4>
            <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
              {review.tasting_notes}
            </p>
          </div>
        )}

        {/* What Makes It Special */}
        {review.unique_feature && (
          <div className="bg-gradient-to-r from-beer-amber/5 via-beer-gold/5 to-beer-cream border border-beer-amber/20 rounded-xl p-4 mb-4">
            <h4 className="font-bold text-beer-dark text-base mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-beer-amber" />
              What Makes It Special
            </h4>
            <p className="text-gray-700 leading-relaxed text-sm">
              {review.unique_feature}
            </p>
          </div>
        )}

        {/* Brewery Story */}
        {review.brewery_story && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-beer-dark mb-3 text-base">
              About {review.brewery_name}
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {review.brewery_story}
            </p>
            {breweryWebsite && (
              <a 
                href={breweryWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-beer-amber text-white px-4 py-2 rounded-lg hover:bg-beer-gold transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
              >
                Visit {review.brewery_name}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 