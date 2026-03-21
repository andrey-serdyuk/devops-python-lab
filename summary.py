# show movie statistics.
def show_summary(movies):
    if not movies:
        print("No movies available")
        return

    total = len(movies)
    rating_sum = 0

    for movie in movies:
        rating_sum += movie["rating"]

    average = rating_sum / total

    print("\n--- Movie Summary ---")
    print(f"Total movies: {total}")
    print(f"Average rating: {average:.2f}")

    best = max(movies, key=lambda m: m["rating"])
    print(f"Top movie: {best['title']} ({best['rating']})")
