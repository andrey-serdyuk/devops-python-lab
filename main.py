from display_movies import display_menu
from manage_movies import manage_menu
from summary import show_summary
from dummy_data import load_dummy_data
from storage import save_movies, load_movies

movies = []

def main():
    global movies

    while True:
        print()
        print("MOVIE TRACKER")
        print("1 Display movies")
        print("2 Manage movies")
        print("3 Summary")
        print("4 Load dummy data")
        print("5 Save movies to file")
        print("6 Load movies from file")
        print("7 Exit")

        choice = input("Select option: ")
        print(f"selected option: {choice}")
        
        if choice == "1":
            display_menu(movies)
        elif choice == "2":
            movies = manage_menu(movies)
        elif choice == "3":
            show_summary(movies)
        elif choice == "4":
            movies = load_dummy_data(movies)
        elif choice == "5":
            save_movies(movies)
        elif choice == "6":
            movies = load_movies()
        elif choice == "7":
            print("Goodbye")
            break
        else:
            print("Invalid input")


main()