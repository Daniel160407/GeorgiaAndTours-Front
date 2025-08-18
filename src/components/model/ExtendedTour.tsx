import { useState } from 'react';
import CommentsList from '../lists/CommentsList';
import CommentForm from '../forms/CommentForm';
import '../../styles/model/ExtendedTour.scss';
import BackBtn from '../uiComponents/BackBtn';

interface Tour {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  about?: string;
  duration?: string;
  price?: string;
  direction?: string;
}

interface Translations {
  [key: string]: {
    descriptionTitle: string;
    aboutTitle: string;
    detailsTitle: string;
    duration: string;
    price: string;
    direction: string;
  };
}

type Language = 'ENG' | 'RUS';

const ExtendedTour = ({ tour, comments, onCommentSubmit, onBackArrowClick }: { tour: Tour }) => {
  const [activeLanguage, setActiveLanguage] = useState<Language>('ENG');

  const translations: Translations = {
    ENG: {
      descriptionTitle: 'Tour description',
      aboutTitle: 'About this tour',
      detailsTitle: 'Tour details',
      duration: 'Duration',
      price: 'Price',
      direction: 'Direction',
    },
    RUS: {
      descriptionTitle: 'Описание тура',
      aboutTitle: 'Про этот тур',
      detailsTitle: 'Детали тура',
      duration: 'Продолжительность',
      price: 'Цена',
      direction: 'Направление',
    },
  };

  const handleLanguageChange = (language: Language) => {
    setActiveLanguage(language);
  };

  return (
    <article className="extended-tour">
      <BackBtn onClick={onBackArrowClick} />
      <div className="language-selector">
        {(['ENG', 'RUS'] as Language[]).map((language) => (
          <button
            key={language}
            className={`language-btn ${activeLanguage === language ? 'active' : ''}`}
            onClick={() => handleLanguageChange(language)}
          >
            {language}
          </button>
        ))}
      </div>

      <div className="tour-header">
        <img src={tour.imageUrl} alt={tour.name} className="tour-image" loading="lazy" />
        <h1 className="tour-title">{tour.name}</h1>
      </div>

      <section className="tour-section">
        <h2 className="section-title">{translations[activeLanguage].descriptionTitle}</h2>
        <p className="tour-description">{tour.description}</p>
      </section>

      {(tour.duration || tour.price || tour.difficulty) && (
        <section className="tour-details">
          <h2 className="section-title">{translations[activeLanguage].detailsTitle}</h2>
          <ul className="details-list">
            {tour.direction && (
              <li>
                <strong>{translations[activeLanguage].direction}:</strong> {tour.direction}
              </li>
            )}
            {tour.duration && (
              <li>
                <strong>{translations[activeLanguage].duration}:</strong> {tour.duration}
              </li>
            )}
            {tour.price && (
              <li className='price-container'>
                <strong>{translations[activeLanguage].price}:</strong>{' '}
                {(() => {
                  const [integer, decimal] = tour.price.split('.');
                  return (
                    <>
                      <span className="price-integer">{integer}</span>
                      {decimal && <span className="price-decimal">.{decimal}</span>}
                    </>
                  );
                })()}
              </li>
            )}
          </ul>
        </section>
      )}
      <CommentForm tourId={tour.id} onSubmit={onCommentSubmit} />
      <CommentsList comments={comments} />
    </article>
  );
};

export default ExtendedTour;
