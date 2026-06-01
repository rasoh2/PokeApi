import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function usePokemonList() {
  const { data, error, isLoading } = useSWR('https://pokeapi.co/api/v2/pokemon?limit=1025', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const pokemonList = data?.results?.map((p) => {
    const id = p.url.split('/').filter(Boolean).pop();
    return {
      name: p.name,
      url: p.url,
      id: parseInt(id),
    };
  }) || [];

  return {
    pokemones: pokemonList,
    isLoading,
    isError: error,
  };
}

// Hook para cargar los detalles individuales de un Pokémon, con localStorage caché y fallbacks robustos
export function usePokemonDetails(name) {
  const cacheKey = `pokemon-detail-${name}`;
  
  const { data, error, isLoading } = useSWR(
    name ? `https://pokeapi.co/api/v2/pokemon/${name}` : null,
    async (url) => {
      // Intentar leer de localStorage de forma segura
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.types && parsed.types.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('LocalStorage parse error, fetching fresh data', e);
        localStorage.removeItem(cacheKey);
      }
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Error de red HTTP: ${res.status}`);
      }
      const pokemonData = await res.json();

      let speciesData = null;
      let flavorText = null;
      let genera = 'Pokémon';
      let evolutionChainUrl = null;

      // Obtener datos de la especie de forma segura para prevenir caídas en formas alternas
      try {
        if (pokemonData.species?.url) {
          const speciesRes = await fetch(pokemonData.species.url);
          if (speciesRes.ok) {
            speciesData = await speciesRes.json();
            flavorText =
              speciesData.flavor_text_entries?.find((entry) => entry.language.name === 'es') ||
              speciesData.flavor_text_entries?.find((entry) => entry.language.name === 'en');
            genera = speciesData.genera?.find((g) => g.language.name === 'es')?.genus || 'Pokémon';
            evolutionChainUrl = speciesData.evolution_chain?.url || null;
          }
        }
      } catch (err) {
        console.warn(`No se pudieron obtener detalles de especie para ${name}, usando valores por defecto:`, err);
      }

      const detailedData = {
        ...pokemonData,
        description: flavorText?.flavor_text?.replace(/\f/g, ' ') || 'Sin descripción disponible',
        genera: genera,
        evolutionChainUrl: evolutionChainUrl,
        base_happiness: speciesData?.base_happiness || 70,
        capture_rate: speciesData?.capture_rate || 255,
      };

      // Guardar en caché de forma segura ante desbordamiento de cuota (QuotaExceededError)
      try {
        localStorage.setItem(cacheKey, JSON.stringify(detailedData));
      } catch (err) {
        console.warn(`No se pudo guardar ${name} en LocalStorage (cupo lleno):`, err);
        // Si el almacenamiento está lleno, limpiamos la caché vieja para liberar espacio
        if (err.name === 'QuotaExceededError' || err.code === 22) {
          try {
            for (let i = localStorage.length - 1; i >= 0; i--) {
              const key = localStorage.key(i);
              if (key && key.startsWith('pokemon-detail-')) {
                localStorage.removeItem(key);
              }
            }
            // Reintentar guardar la ficha actual una vez limpio
            localStorage.setItem(cacheKey, JSON.stringify(detailedData));
          } catch (cleanErr) {
            console.error('No se pudo guardar la clave incluso tras vaciar la caché:', cleanErr);
          }
        }
      }
      return detailedData;
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    pokemon: data,
    isLoading,
    isError: error,
  };
}
