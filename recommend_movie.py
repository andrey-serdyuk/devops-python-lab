import random


def recommend_a_movie(movies):
    print("\nRECOMMENDED MOVIE\n")
    if len(movies) == 0:
        print("There is no movies in the database!")
        return
    best_movies = []
    for mov in movies: 
        if mov['rating'] >= 8.0:
            best_movies.append(mov.copy())
    if len(best_movies) == 0:
        print("There is no recommended movies (rating 8 and above)!")
    rand_movie = random.randint(0, (len(best_movies)-1))
    print(f"The movie we recommend to you is:")
    print(f"""Movie Title: {best_movies[rand_movie]["title"]}
Movie Genre: {best_movies[rand_movie]["genre"]}
Movie Rating: {best_movies[rand_movie]["rating"]}""")
    input("\nPress enter to continue...")