from print_table import print_table

def display_menu(movies):
    while True:
        print()
        print("Display Movies")
        print("1 Show all movies")
        print("2 Filter by genre")
        print("3 Search movie")
        print("4 Sort by rating")
        print("5 Back")

        choice = input("Select option: ")
        if choice == "1":
            if not movies:
                print("No movies available")
                continue
            print_table(movies)
        # filter
        elif choice == "2":
            genre = input("Enter genre: ")
            filtered = []
            for movie in movies:
                if movie["genre"].lower() == genre.lower():
                    filtered.append(movie)
            if filtered:
                print_table(filtered)
            else:
                print("No movies found")
        # search
        elif choice == "3":
            keyword = input("Search movie: ").lower()
            results = []

            for movie in movies:
                if keyword in movie["title"].lower():
                    results.append(movie)

            if results:
                print_table(results)
            else:
                print("No movies found")

        # sort
        elif choice == "4":
            sorted_movies = sorted(movies, key=lambda m: m["rating"], reverse=True)
            print_table(sorted_movies)
        
        # back
        elif choice == "5":
            break
        else:
            print("Invalid input")