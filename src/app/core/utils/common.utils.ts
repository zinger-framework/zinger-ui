import {ElementRef} from "@angular/core";

export function handleError(error: any,apiError: {},form: string,parentRef: ElementRef<HTMLElement>){
  let data = {key: "api-error", value: ""}
  if(error['error']['reason']!=null){
    if(error['error']['reason'].constructor.name == "String"){
      data['value'] = error['error']['reason']
      parentRef.nativeElement.querySelector("div."+form+"-api-error").innerHTML = "<span style=\"color:red\">"+ error['error']['reason'] + "</span>";
    }else{
      let reasonKey = Object.keys(error['error']['reason'])[0];
      data['key'] = reasonKey;
      data['value'] = error['error']['reason'][reasonKey][0];
      apiError[reasonKey] = error['error']['reason'][reasonKey][0];
    }
  }else if(error['error']['message']!=null){
    data['value'] = error['error']['message']
    parentRef.nativeElement.querySelector("div."+form+"-api-error").innerHTML = "<span style=\"color:red\">"+ error['error']['message'] + "</span>";
  }else{
    console.log("Something is wrong")
  }
  return data
}

