import React, { useState, useEffect } from 'react';


import tmdb from '../services/tmdb';

import { FeaturedMovie } from '../components/FeaturedMovie';
import { Header } from '../components/Header';
import { MovieRow } from '../components/MovieRow';

export function Home() {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    async function loadAll() {
      let list = await tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await tmdb.getMovieInfo(chosen.id, 'tv');

      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    function scrollListerner() {
      if(window.scrollY > 10) setBlackHeader(true);
      else setBlackHeader(false);
    }

    window.addEventListener('scroll', scrollListerner);

    return () => {
      window.removeEventListener('scroll', scrollListerner);
    }
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
      Feito com <span role='img' aria-label="coração">&#9829;</span> por Gabriel Martins <br/>
        Direitos de Imagem para Netflix<br/>
        Dados pegos no site Themoviedb.org 
      </footer>

      {movieList.length <= 0 && <div className="loading">
          <img src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif" alt="Carregando" />
      </div>}
    </div>
  );
}