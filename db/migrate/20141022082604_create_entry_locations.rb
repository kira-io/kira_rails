class CreateEntryLocations < ActiveRecord::Migration
  def change
    create_table :entry_locations do |t|
      t.float :latitude
      t.float :longitude
      t.string :city
      t.string :country

      t.timestamps
    end
  end
end
