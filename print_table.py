def print_table(movies):
    print()
    print("-" * 75)
    print(f"{'ID':<5}{'Title':<25}{'Genre':<15}{'Rating':<10}{'Status':<10}")
    print("-" * 75)

    for i, movie in enumerate(movies, start=1):
        # Handle cases where old data might not have the 'watched' key
        status = "Watched" if movie.get("watched", True) else "Watchlist"
        print(f"{i:<5}{movie['title']:<25}{movie['genre']:<15}{movie['rating']:<10}{status:<10}")

    print("-" * 75)