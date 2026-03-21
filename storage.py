import json

# save movies to JSON file.
def save_movies(movies):
    filename = input("Enter filename: ")

    try:
        with open(filename, "w") as file:
            json.dump(movies, file, indent=4)

        print("Movies saved")

    except Exception:
        print("Error saving file")

# load movies from JSON file.
def load_movies():
    filename = input("Enter filename: ")

    try:
        with open(filename, "r") as file:
            movies = json.load(file)

        print("Movies loaded")
        return movies

    except Exception:
        print("Error loading file")
        return []
