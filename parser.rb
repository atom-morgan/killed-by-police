require 'smarter_csv'
require 'pp'
require 'json'

filename = ARGV[0]
puts "Starting to parse file: " + filename

data = SmarterCSV.process(filename)

myData = Array.new

data.map do |item|
  myHash = Hash.new
  item.map do |key, value|
    if (key.to_s == 'date')
      myHash[:reported_date] = value.gsub(/([(].*[)])/, '').strip
    end

    if (key.to_s == 'state')
      myHash[:geo_state] = value.to_s
    end

    if (key.to_s == 'gender/race')
      if value =~ /[MF][\/][a-zA-z]/
        myHash[:gender] = value.gsub(/\/.$/, '').to_s
        myHash[:race] = value.gsub(/[mfMF][\/]/, '').to_s
      else
        if value =~ /[MF]/
          myHash[:gender] = value.to_s
          myHash[:race] = nil
        end
        if value =~ /[WBILA]|(PI)/
          myHash[:race] = value.to_s
          myHash[:gender] = nil
        end
      end
    end

    if (key.to_s == 'name/age')
      if value =~ /,/
        myHash[:name] = value.gsub(/,{1}.*/, '').strip.to_s
        myHash[:age] = value.gsub(/.*,{1}/, '').strip.to_s
      else
        if value =~ /\d/
          myHash[:age] = value.to_s
        else
          myHash[:name] = value.to_s
        end
      end
    end

    if (key.to_s == 'unknown')
      item[key] = value.gsub(/\n/, '')
      if value.length > 1
        myHash[:source_of_death] = value.tr("\n", ",")
      else
        myHash[:source_of_death] = value.to_s
      end
    end

    if (key.to_s == 'kbp_link')
      myHash[:kbp_link] = value.to_s
    end

    if (key.to_s == 'news_link')
      myHash[:news_link] = value.to_s
    end

  end
  myData.push(myHash)
end

myData = myData.to_json

newFileName = /[kbp].*[^.csv]/.match(filename).to_s

File.open("./json-data/" + newFileName + ".json", "w") do |f|
  f.write(myData)
end

puts "JSON file created: json-data/" + newFileName + ".json"
