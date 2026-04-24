# load dummy movies.
def load_dummy_data(movies):
    dummy = [
        {"title": "Inception", "genre": "Sci-Fi", "rating": 9},
        {"title": "Interstellar", "genre": "Sci-Fi", "rating": 8.7},
        {"title": "Some Mid Movie", "genre": "Action", "rating": 6.4},
        {"title": "The Dark Knight", "genre": "Action", "rating": 9.5},
        {"title": "Titanic", "genre": "Drama", "rating": 8}
    ]

    print("\n1 Replace data")
    print("2 Append data")

    choice = input("Select option: ")

    if choice == "1":
        print("Data replaced")
        return dummy

    elif choice == "2":
        movies.extend(dummy)
        print("Data appended")
        return movies

    else:
        print("Invalid choice")
        return movies
