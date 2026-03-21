def print_table(movies):
    print()
    print("-" * 60)
    print(f"{'ID':<5}{'Title':<25}{'Genre':<15}{'Rating':<10}")
    print("-" * 60)

    for i, movie in enumerate(movies, start=1):
        print(f"{i:<5}{movie['title']:<25}{movie['genre']:<15}{movie['rating']:<10}")

    print("-" * 60)