from shutil import copyfileobj

from fastapi import FastAPI, UploadFile

app = FastAPI()


@app.post('/file2keyword')
async def file2keyword(files: list[UploadFile]):
  for file in files:
    with open(f'./_{file.filename}', 'wb') as f:
      copyfileobj(file.file, f)
  return ['ok', 'nhe']
