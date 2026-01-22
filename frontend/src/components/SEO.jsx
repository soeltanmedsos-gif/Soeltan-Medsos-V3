import { Helmet } from 'react-helmet-async';

/**
 * SEO Component
 * Dynamic meta tags for better SEO
 */
export default function SEO({ 
  title = 'Soeltan Medsos - Layanan Social Media Marketing Terpercaya',
  description = 'Platform Social Media Marketing terpercaya untuk meningkatkan kredibilitas dan jangkauan akun bisnis Anda. Followers, Likes, Views untuk Instagram, TikTok, YouTube, dan lainnya.',
  keywords = 'social media marketing, smm panel, followers instagram, likes tiktok, views youtube, jasa sosmed',
  ogImage = '/og-image.jpg'
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
