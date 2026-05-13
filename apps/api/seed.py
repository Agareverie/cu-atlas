from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["cu_atlas_db"]

# Drop the initial databases
db["buildings"].drop()

db["buildings"].insert_many([
    # ENGINEERING
    {"code": "ENG1", "name_en": "Engineering 1", "name_th": "ตึก 1", "pronunciation_th": "tuek-nueng", "faculty": "Engineering"},
    {"code": "ENG2", "name_en": "Engineering 2", "name_th": "ตึก 2", "pronunciation_th": "tuek-song", "faculty": "Engineering"},
    {"code": "ENG3", "name_en": "Engineering 3", "name_th": "ตึก 3", "pronunciation_th": "tuek-sam", "faculty": "Engineering"},
    {"code": "ENG4", "name_en": "Engineering 4", "name_th": "ตึก 4", "pronunciation_th": "tuek-si", "faculty": "Engineering"},
    {"code": "ENG5", "name_en": "Engineering 5", "name_th": "ตึก 5", "pronunciation_th": "tuek-ha", "faculty": "Engineering"},
    {"code": "EN100", "name_en": "Centennial Memorial Building", "name_th": "ตึก 100 ปี", "pronunciation_th": "tuek-roi-pi", "faculty": "Engineering"},
    {"code": "HANS", "name_en": "Mechanical Engineering (Hans Building)", "name_th": "ตึกภาควิชาวิศวกรรมเครื่องกล (ฮันส์ บันตลิ)", "pronunciation_th": "tuek-pak-wi-sha-wi-sa-wa-gum-crueng-gon (Hans Bantle)", "faculty": "Engineering"},
    {"code": "IE", "name_en": "Industrial Engineering", "name_th": "ตึกวิศวกรรมอุตสาหการ", "pronunciation_th": "tuek-wi-sa-wa-gum-oot-sa-ha-garn", "faculty": "Engineering"},
    {"code": "EE", "name_en": "Electrical Engineering", "name_th": "ตึกวิศวกรรมไฟฟ้า", "pronunciation_th": "tuek-wi-sa-wa-gum-fai-fa", "faculty": "Engineering"},
    {"code": "EELAB", "name_en": "Electrical Engineering Laboratory", "name_th": "ตึกภาควิชาวิศวกรรมไฟฟ้า", "pronunciation_th": "tuek-pak-wi-sha-wi-sa-wa-gum-fai-fa", "faculty": "Engineering"},
    {"code": "IELAB", "name_en": "Industrial Engineering Laboratory", "name_th": "ตึกภาควิชาวิศวกรรมอุตสาหการ", "pronunciation_th": "tuek-pak-wi-sha-wi-sa-wa-gum-oot-sa-ha-garn", "faculty": "Engineering"},
    {"code": "ENV", "name_en": "Environmental Engineering", "name_th": "ตึกวิศวกรรมสิ่งแวดล้อม", "pronunciation_th": "tuek-wi-sa-wa-gum-sing-wadd-lorm", "faculty": "Engineering"},
    {"code": "MNBLD", "name_en": "Mining and Petroleum Engineering", "name_th": "ตึกภาควิชาวิศวกรรมเหมืองแร่และปิโตรเลียม", "pronunciation_th": "tuek-pak-wi-sha-wi-sa-wa-gum-mueng-rae-lae-petroleum", "faculty": "Engineering"},
    {"code": "MTBLD", "name_en": "Metallurgical Engineering", "name_th": "ตึกภาควิชาวิศวกรรมโลหการ", "pronunciation_th": "tuek-pak-wi-sha-wi-sa-wa-gum-lo-ha-garn", "faculty": "Engineering"},
])

client.close()
print("Database seeded successfully")