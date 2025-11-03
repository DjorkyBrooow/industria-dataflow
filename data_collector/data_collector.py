import csv

DATASET_FILE_NAME = "./data_collector/dataset.csv"

def read_file(file_name):
    with open(file_name, newline='') as csvfile:
        datareader = csv.reader(csvfile, delimiter=',', quotechar='|')
        return datareader

def write_new_line(file_name, new_values):
    with open(file_name, 'w', newline=''):
        datawriter = csv.writer(file_name, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
        datawriter.writerow(new_values)

def generate_new_line():
    new_line = []

    return new_line


def main():
    new_line = generate_new_line()
    print(new_line)
    # read_file(DATASET_FILE_NAME)
    # write_new_line(DATASET_FILE_NAME, new_line)


if __name__ == "__main__":
    main()