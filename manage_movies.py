def manage_menu(movies):
    while True:
        print("Manage Movies")
        print("-" * 25)
        print("1 Add movie")
        print("2 Update rating")
        print("3 Remove movie")
        print("4 Back")

        choice = input("Select option: ")

        # add a movie
        if choice == "1":
            title = input("Movie title: ")
            genre = input("Genre: ")

            try:
                rating = float(input("Rating (0-10): "))
            except ValueError:
                print("Invalid rating")
                continue

            movie = {
                "title": title,
                "genre": genre,
                "rating": rating
            }

            movies.append(movie)
            print("Movie added")

        # update a movie
        elif choice == "2":
            title = input("Movie title to update: ")

            for movie in movies:
                if movie["title"].lower() == title.lower():
                    try:
                        new_rating = float(input("New rating: "))
                        movie["rating"] = new_rating
                        print("Rating updated")
                    except ValueError:
                        print("Invalid rating")

        # remove a movie
        elif choice == "3":
            title = input("Movie title to remove: ")
            for movie in movies:
                if movie["title"].lower() == title.lower():
                    movies.remove(movie)
                    print("Movie removed")
                    break
        elif choice == "4":
            return movies
        else:
            print("Invalid input")
