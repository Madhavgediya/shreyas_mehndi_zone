import { useEffect } from 'react';

export const SEO = ({
  title,
  description,
  image,
  url,
}) => {
  useEffect(() => {
    const baseTitle = "Shreya's Mehndi Zone | Bespoke Bridal & Designer Henna";
    document.title = title ? `${title} | Shreya's Mehndi Zone` : baseTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        description ||
          'Explore premium Bridal, Arabic, and Contemporary Mehndi designs with Virtual Try-On and effortless online booking by Shreya Gediya.'
      );
    }
  }, [title, description, image, url]);

  return null;
};

export default SEO;
