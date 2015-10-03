require 'smarter_csv'
require 'pp'
require 'json'

filename = ARGV[0]
puts "Starting to parse file: " + filename

data = SmarterCSV.process(filename)

my_data = data.map do |item|
  my_hash = {}
  item.map do |key, value|
    if (key.to_s == 'date')
      my_hash[:reported_date] = value.gsub(/([(].*[)])/, '').strip
    end

    if (key.to_s == 'state')
      my_hash[:geo_state] = value.to_s
    end

    if (key.to_s == 'gender/race')
      if value =~ /[MF][\/][a-zA-z]/
        my_hash[:gender] = value.gsub(/\/.$/, '').to_s
        my_hash[:race] = value.gsub(/[mfMF][\/]/, '').to_s
      else
        if value =~ /[MF]/
          my_hash[:gender] = value.to_s
          my_hash[:race] = nil
        end
        if value =~ /[WBILA]|(PI)/
          my_hash[:race] = value.to_s
          my_hash[:gender] = nil
        end
      end
    end

    if (key.to_s == 'name/age')
      if value =~ /,/
        my_hash[:name] = value.gsub(/,{1}.*/, '').strip.to_s
        my_hash[:age] = value.gsub(/.*,{1}/, '').strip.to_s
      else
        if value =~ /\d/
          my_hash[:age] = value.to_s
        else
          my_hash[:name] = value.to_s
        end
      end
    end

    if (key.to_s == 'unknown')
      item[key] = value.gsub(/\n/, '')
      if value.length > 1
        my_hash[:source_of_death] = value.tr("\n", ",")
      else
        my_hash[:source_of_death] = value.to_s
      end
    end

    if (key.to_s == 'kbp_link')
      my_hash[:kbp_link] = value.to_s
    end

    if (key.to_s == 'news_link')
      my_hash[:news_link] = value.to_s
    end
  end
  my_hash
end

my_data = my_data.to_json

new_filename = /[kbp].*[^.csv]/.match(filename).to_s

File.open("./json-data/" + new_filename + ".json", "w") do |f|
  f.write(my_data)
end

puts "JSON file created: json-data/" + new_filename + ".json"
